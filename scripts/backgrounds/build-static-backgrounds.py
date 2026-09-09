import json, hashlib, argparse
from pathlib import Path
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
parser=argparse.ArgumentParser(description='Encode backed-up background PNGs as full-resolution WebP files.')
parser.add_argument('--backup', required=True)
parser.add_argument('--out', required=True)
parser.add_argument('--prefix', required=True, help='Versioned Supabase object prefix, e.g. backgrounds/static-20260909')
args=parser.parse_args()
root=Path(args.backup)
manifest=json.loads((root/'manifest.json').read_text())
out=Path(args.out)
out.mkdir(parents=True,exist_ok=True)
def convert(item):
    source=root/item['local_path']
    assert hashlib.sha256(source.read_bytes()).hexdigest()==item['sha256']
    dest=out/(source.stem+'.webp')
    with Image.open(source) as im:
        im.convert('RGB').save(dest,'WEBP',quality=92,method=6)
        dims=im.size
    with Image.open(dest) as im:
        im.load();assert im.size==dims
    return {'object_key':args.prefix.rstrip('/')+'/'+dest.name,'file':str(dest.resolve()),'bytes':dest.stat().st_size,'md5':hashlib.md5(dest.read_bytes()).hexdigest(),'source_sha256':item['sha256'],'dimensions':dims}
with ThreadPoolExecutor(max_workers=4) as pool:
    results=list(pool.map(convert,manifest['files']))
(out/'manifest.json').write_text(json.dumps(results,indent=2))
print(json.dumps({'files':len(results),'bytes':sum(r['bytes'] for r in results)}))
