#!/usr/bin/env python3
import argparse
from pathlib import Path

from PIL import Image, ImageOps


WIDTH = 2816
HEIGHT = 1536


def parse_args():
    parser = argparse.ArgumentParser(
        description='Normalize generated background candidates to the website hero canvas.'
    )
    parser.add_argument(
        '--dir',
        default='tools/background-generation/generated/summer-active-clear',
        help='Directory containing candidate PNGs.',
    )
    parser.add_argument(
        '--season',
        default='summer',
        help='Season token to match in canonical filenames, or "all".',
    )
    parser.add_argument(
        '--locations',
        default='',
        help='Optional comma-separated location ids to include.',
    )
    parser.add_argument(
        '--skies',
        default='',
        help='Optional comma-separated sky variants to include.',
    )
    return parser.parse_args()


def split_csv(value):
    return {item.strip().lower() for item in value.split(',') if item.strip()}


def is_candidate(path, season, locations, skies):
    parts = path.stem.split('_')
    if len(parts) != 4:
        return False

    location, file_season, _segment, sky = parts
    if season != 'all' and file_season != season:
        return False
    if locations and location not in locations:
        return False
    if skies and sky not in skies:
        return False
    return True


def main():
    args = parse_args()
    source_dir = Path(args.dir)
    season = args.season.strip().lower()
    locations = split_csv(args.locations)
    skies = split_csv(args.skies)
    paths = sorted(
        path for path in source_dir.glob('*.png')
        if is_candidate(path, season, locations, skies)
    )

    if not paths:
        raise SystemExit(f'No matching candidates found in {source_dir}')

    for path in paths:
        with Image.open(path) as image:
            normalized = ImageOps.fit(
                image.convert('RGB'),
                (WIDTH, HEIGHT),
                method=Image.Resampling.LANCZOS,
                centering=(0.5, 0.5),
            )
            normalized.save(path, optimize=True)
            print(f'{path}: {WIDTH}x{HEIGHT}')


if __name__ == '__main__':
    main()
