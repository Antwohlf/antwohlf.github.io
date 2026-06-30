import fs from 'node:fs';
import path from 'node:path';

export const BUCKET = 'personal-website';
export const PREFIX = 'backgrounds';
export const LOCATIONS = ['tokyo', 'losangeles', 'annarbor', 'detroit', 'nyc', 'sansebastian'];
export const ACTIVE_LOCATIONS = ['detroit', 'annarbor', 'nyc', 'sansebastian'];
export const SEGMENTS = ['morning', 'day', 'evening', 'night'];
export const SKIES = ['clear', 'partly', 'cloudy', 'dark'];
export const SEASONS = ['spring', 'summer', 'fall', 'winter'];
export const DEFAULT_SEASONS = ['spring', 'summer', 'fall', 'winter'];

export const loadDotEnv = (cwd = process.cwd()) => {
  const envPath = path.join(cwd, '.env');

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  let i;

  for (i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) {
      continue;
    }

    const key = match[1];
    let value = match[2];

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] == null || process.env[key] === '') {
      process.env[key] = value;
    }
  }
};

export const requireEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const encodeObjectKey = (key) => key.split('/').map(encodeURIComponent).join('/');

export const getArgValue = (args, name, defaultValue = '') => {
  const prefix = `${name}=`;
  const hit = args.find((arg) => arg.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : defaultValue;
};
