#!/usr/bin/env python3
"""Build a complete reviewed seasonal release without changing source pixels."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import itertools
import json
from pathlib import Path
import re
from PIL import Image

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source', type=Path, required=True)
parser.add_argument('--out', type=Path, required=True)
parser.add_argument('--release', required=True)
args = parser.parse_args()
assert re.fullmatch(r'[a-z0-9-]+', args.release), 'Unsafe release name'
source = args.source.resolve()
out = args.out.resolve()
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
rows = json.loads((source / 'manifest.json').read_text())
matrix = json.loads((source / 'review/matrix-evidence.json').read_text())
expected = {f'{c}_{s}_{t}_{w}.png' for c, s, t, w in itertools.product(
    ['detroit', 'annarbor', 'nyc', 'sansebastian'],
    ['spring', 'summer', 'fall', 'winter'],
    ['morning', 'day', 'evening', 'night'],
    ['clear', 'partly', 'cloudy', 'dark'])}
assert len(rows) == 256 and {r['filename'] for r in rows} == expected
assert matrix['complete']
native_hashes = {}
for verdict in matrix['matrices'].values():
    assert verdict['status'] in ['pass', 'pass-with-advisory']
    native_hashes.update(verdict['current_hashes'])
assert set(native_hashes) == expected

# Validate every reviewed delivery and original before creating release output.
for row in rows:
    name = row['filename']
    assert row['status'] == 'reviewed', name
    assert row['reviews'][-1]['sha256'] == row['sha256'], name
    assert sha(source / name) == row['sha256'], name
    assert sha(source / 'native-originals' / name) == native_hashes[name], name
    with Image.open(source / name) as im:
        im.load()
        assert im.size == (2816, 1536), name

out.mkdir(parents=True, exist_ok=True)
assert not (out / 'release.json').exists(), 'Release already built; reuse its manifest'
webp_dir = out / 'webp'
webp_dir.mkdir(exist_ok=True)
public_prefix = f'backgrounds/static-{args.release}'
private_prefix = f'backgrounds/releases/{args.release}'

def encode(row):
    name = row['filename']
    dest = webp_dir / (Path(name).stem + '.webp')
    with Image.open(source / name) as im:
        im.convert('RGB').save(dest, 'WEBP', quality=92, method=6)
    with Image.open(dest) as im:
        im.load()
        assert im.size == (2816, 1536)
    files = []
    for file, key, visibility, mime in [
        (dest, f'{public_prefix}/{dest.name}', 'public', 'image/webp'),
        (source / name, f'{private_prefix}/delivery/{name}', 'private', 'image/png'),
        (source / 'native-originals' / name, f'{private_prefix}/native/{name}', 'private', 'image/png'),
    ]:
        files.append(dict(file=str(file), key=key, visibility=visibility,
                          content_type=mime, bytes=file.stat().st_size, sha256=sha(file)))
    return dict(filename=name, source_sha256=row['sha256'],
                native_sha256=native_hashes[name], dimensions=[2816, 1536], files=files)

with ThreadPoolExecutor(max_workers=4) as pool:
    assets = list(pool.map(encode, sorted(rows, key=lambda r: r['filename'])))
release = dict(release=args.release, source_manifest_sha256=sha(source/'manifest.json'),
               public_prefix=public_prefix, private_prefix=private_prefix,
               source=str(source), assets=assets)
(out / 'release.json').write_text(json.dumps(release, indent=2) + '\n')
# Portable provenance archive excludes machine-specific paths.
portable = {k:v for k,v in release.items() if k not in ['source', 'assets']}
portable['assets'] = [{**{k:v for k,v in a.items() if k != 'files'},
                       'files': [{k:v for k,v in f.items() if k != 'file'} for f in a['files']]}
                      for a in assets]
(out / 'archive-manifest.json').write_text(json.dumps(portable, indent=2) + '\n')
print(json.dumps({'assets':len(assets), 'objects':sum(len(a['files']) for a in assets),
                  'bytes':sum(f['bytes'] for a in assets for f in a['files']),
                  'public_prefix':public_prefix, 'manifest':str(out/'release.json')}))
