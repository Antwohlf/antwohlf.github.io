#!/usr/bin/env python3
"""Read public project signals; never export private repositories or host telemetry."""
import argparse, concurrent.futures, datetime as dt, json, os, subprocess, time, urllib.request, urllib.error
from pathlib import Path
ROOT = Path(__file__).resolve().parent
PROJECTS = {
    'pizza': ('https://www.apizzamichigan.com', 'Antwohlf/apizzamichigan'),
    'resume': ('https://resumerevamped.com', None),
    'duo': ('https://www.duocalculator.com', 'Antwohlf/duocalculator'),
    'builthere': ('https://builthere.city', 'Antwohlf/builthere.city'),
}
def now(): return dt.datetime.now(dt.timezone.utc).isoformat()
def signal(label, state, detail, url=None, **extra):
    return dict(label=label,state=state,detail=detail,url=url,checkedAt=now(),staleAfterSeconds=900,**extra)
def probe(url):
    start=time.monotonic()
    try:
        req=urllib.request.Request(url,headers={'User-Agent':'ProjectTownStatus/1.0'})
        with urllib.request.urlopen(req, timeout=12) as response:
            response.read(1024)
            return signal('Website', 'ok', f'HTTP {response.status} in {round((time.monotonic()-start)*1000)} ms. This checks the public page, not every application feature.', url)
    except urllib.error.HTTPError as error:
        return signal('Website','blocked' if error.code in (401,403,429) else 'failed', f'HTTP {error.code}. No access gate bypassed.',url)
    except Exception as error:
        return signal('Website','failed',f'Public-page check unavailable ({type(error).__name__}).',url)
def gh(path):
    result=subprocess.run(['gh','api',path],capture_output=True,text=True,timeout=20,check=True)
    return json.loads(result.stdout)
def repository(repo):
    url='https://github.com/'+repo
    try:
        meta=gh('repos/'+repo)
        if meta.get('private') is not False:
            return [signal('Repository','unknown','Private repository activity is not exported.')]
        runs=gh('repos/'+repo+'/actions/runs?per_page=5').get('workflow_runs',[])
        pulls=gh('repos/'+repo+'/pulls?state=open&per_page=100')
        latest=runs[0] if runs else None
        checks=[signal('Review queue','idle',f'{len(pulls)}'+('+' if len(pulls)==100 else '')+' open pull requests. Open does not mean review is required.',url+'/pulls')]
        if latest:
            state='running' if latest['status']!='completed' else 'failed' if latest.get('conclusion') in ('failure','timed_out','action_required') else 'idle'
            checks.append(signal('Latest workflow',state,f"{latest['name']}: {latest.get('conclusion') or latest['status']}. Only the latest run is represented.",latest['html_url'],eventAt=latest['updated_at']))
        else: checks.append(signal('Latest workflow','idle','No workflow runs returned.',url+'/actions'))
        return checks
    except Exception as error:
        return [signal('Repository','unknown',f'Public GitHub observation unavailable ({type(error).__name__}).',url)]
def food_runtime():
    host=os.environ.get('TOWN_FOOD_SSH_HOST')
    if not host: return []
    command=['ssh','-o','BatchMode=yes','-o','ConnectTimeout=8']
    address=os.environ.get('TOWN_FOOD_SSH_ADDRESS')
    if address: command += ['-o','HostName='+address]
    command += [host,'launchctl list']
    try:
        result=subprocess.run(command,capture_output=True,text=True,timeout=15,check=True)
        expected={'com.apizzamichigan.classifier','com.apizzamichigan.scraper'}
        rows=[line.split() for line in result.stdout.splitlines()]
        running=sum(len(row)==3 and row[2] in expected and row[0].isdigit() for row in rows)
        return [signal('Food runtime','running' if running else 'idle',f'{running} of 2 classifier/scraper supervisors have running process IDs. This is process availability, not proof every child job succeeds.')]
    except Exception as error:
        return [signal('Food runtime','unknown',f'Host observation unavailable ({type(error).__name__}).')]
def collect(output=ROOT/'activity.json'):
    buildings={key:{'signals':[]} for key in (*PROJECTS,'homelab','travel')}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        jobs={pool.submit(probe,url):(key,'http') for key,(url,repo) in PROJECTS.items()}
        for key,(url,repo) in PROJECTS.items():
            if repo: jobs[pool.submit(repository,repo)]=(key,'repo')
        for job in concurrent.futures.as_completed(jobs):
            key,kind=jobs[job];value=job.result();buildings[key]['signals'].extend(value if isinstance(value,list) else [value])
    runtime=food_runtime()
    buildings['pizza']['signals'].extend(runtime)
    buildings['homelab']['signals'].extend(runtime)
    # Only aggregate process availability is exported. Never hostnames, IPs, PIDs,
    # private repository records, sensor states, occupancy, or travel locations.
    for building in buildings.values(): building['signals'].sort(key=lambda x:x['label'])
    snapshot=dict(schemaVersion=1,generatedAt=now(),buildings=buildings)
    temp=output.with_suffix('.tmp');temp.write_text(json.dumps(snapshot,indent=2)+'\n');temp.replace(output)
    print('Activity refreshed at '+snapshot['generatedAt'],flush=True)
    return snapshot
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--output',type=Path,default=ROOT/'activity.json')
    collect(parser.parse_args().output)
