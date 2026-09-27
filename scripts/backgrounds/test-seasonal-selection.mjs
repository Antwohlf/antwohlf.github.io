#!/usr/bin/env node
// Exercise the actual production selector against a built release, including
// spring/winter routes that previously fell back to the older nonseasonal set.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const [manifestPath, sourcePath = 'assets/js/backgrounds.js'] = process.argv.slice(2);
if (!manifestPath) throw new Error('Usage: node scripts/backgrounds/test-seasonal-selection.mjs <release.json> [backgrounds.js]');
const release = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const source = fs.readFileSync(sourcePath, 'utf8');
const checkpoint = '  var locationIndex = getSavedLocationIndex();';
assert.equal(source.split(checkpoint).length, 2);
const instrumented = source.replace(checkpoint,
  '  globalThis.selection = {getImageUrl, getSeason, getTimeSegment, activeLocationIds}; return;\n' + checkpoint);
const element = {querySelectorAll: () => [{}, {}]};
const context = vm.createContext({
  document: {getElementById: () => element, querySelector: () => element},
  window: {matchMedia: () => ({matches:false}), location:{protocol:'https:', hostname:'anthonywohlfeil.com'}},
});
vm.runInContext(instrumented, context);
const {getImageUrl, getSeason, getTimeSegment, activeLocationIds} = context.selection;
assert.deepEqual([...activeLocationIds].sort(), ['annarbor','detroit','nyc','sansebastian']);
const urls = new Set();
for (const asset of release.assets) {
  const [id, season, time, sky] = asset.filename.replace(/\.png$/, '').split('_');
  const url = getImageUrl({id}, season, time, {sky});
  const published = asset.files.find(f => f.visibility === 'public');
  assert.equal(url, 'https://assets.anthonywohlfeil.com/' + published.key, asset.filename);
  urls.add(url);
  if (sky === 'clear') {
    assert.equal(getImageUrl({id}, season, time, null), url);
    assert.equal(getImageUrl({id}, season, time, {sky:'unrecognized'}), url);
  }
}
assert.equal(urls.size,256);
for (const [month,day,season] of [[1,15,'winter'],[3,20,'spring'],[6,21,'summer'],[9,22,'fall'],[12,21,'winter']]) {
  assert.equal(getSeason(month,day,2027),season);
}
for (const [hour,time] of [[8,'morning'],[12,'day'],[18,'evening'],[23,'night']]) assert.equal(getTimeSegment(hour),time);
console.log('PASS: all 256 production routes select the release assets; seasonal dates, time segments, and missing-weather fallback checked.');
