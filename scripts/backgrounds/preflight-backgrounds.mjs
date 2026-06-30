#!/usr/bin/env node

import {
  BUCKET,
  PREFIX,
  LOCATIONS,
  SEGMENTS,
  SKIES,
  DEFAULT_SEASONS,
  loadDotEnv,
  requireEnv,
  getArgValue
} from './shared.mjs';

loadDotEnv();

const args = process.argv.slice(2);
const seasonsArg = getArgValue(args, '--seasons', DEFAULT_SEASONS.join(','));
const seasons = seasonsArg
  .split(',')
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

if (!seasons.length) {
  console.error('No seasons supplied. Use --seasons=winter,spring');
  process.exit(1);
}

const supabaseUrl = requireEnv('SUPABASE_URL');
const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
const apiBase = `${supabaseUrl}/storage/v1/object/list/${BUCKET}`;
const listHeaders = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  'content-type': 'application/json'
};

const listObjects = async () => {
  const names = [];
  const limit = 1000;
  let offset = 0;
  let keepGoing = true;

  while (keepGoing) {
    const body = JSON.stringify({
      prefix: PREFIX,
      limit,
      offset,
      sortBy: { column: 'name', order: 'asc' }
    });
    const response = await fetch(apiBase, {
      method: 'POST',
      headers: listHeaders,
      body
    });

    if (!response.ok) {
      throw new Error(`Storage list failed (${response.status}): ${await response.text()}`);
    }

    const batch = await response.json();
    const filtered = batch.filter((item) => typeof item.name === 'string').map((item) => item.name);
    names.push(...filtered);
    offset += filtered.length;
    keepGoing = filtered.length === limit;
  }

  return names;
};

const expectedNames = () => {
  const output = [];
  let i;
  let j;
  let k;
  let s;

  for (i = 0; i < LOCATIONS.length; i++) {
    for (s = 0; s < seasons.length; s++) {
      for (j = 0; j < SEGMENTS.length; j++) {
        for (k = 0; k < SKIES.length; k++) {
          output.push(`${LOCATIONS[i]}_${seasons[s]}_${SEGMENTS[j]}_${SKIES[k]}.png`);
        }
      }
    }
  }

  return output;
};

const run = async () => {
  const allNames = await listObjects();
  const existing = new Set(allNames);
  const expected = expectedNames();
  const missing = expected.filter((name) => !existing.has(name));
  const canonicalRegex = /^[a-z0-9]+_(spring|summer|fall|winter)_(morning|day|evening|night)_(clear|partly|cloudy|dark)\.png$/;
  const legacyRegex = /^[a-z0-9]+_(morning|day|evening|night)\.png$/;
  const canonicalPresent = allNames.filter((name) => canonicalRegex.test(name));
  const legacyPresent = allNames.filter((name) => legacyRegex.test(name));
  const unexpectedCanonical = canonicalPresent.filter((name) => expected.indexOf(name) === -1);

  console.log('Preflight Results');
  console.log(`- checked seasons: ${seasons.join(', ')}`);
  console.log(`- expected files: ${expected.length}`);
  console.log(`- existing canonical files: ${canonicalPresent.length}`);
  console.log(`- legacy files still present: ${legacyPresent.length}`);
  console.log(`- missing expected files: ${missing.length}`);
  console.log(`- unexpected canonical files: ${unexpectedCanonical.length}`);

  if (missing.length) {
    console.log('');
    console.log('Missing');
    missing.forEach((name) => console.log(`- ${name}`));
  }

  if (unexpectedCanonical.length) {
    console.log('');
    console.log('Unexpected Canonical');
    unexpectedCanonical.forEach((name) => console.log(`- ${name}`));
  }

  if (missing.length > 0) {
    process.exitCode = 1;
  }
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
