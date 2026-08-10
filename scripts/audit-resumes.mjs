#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const resumeDirectory = path.join(root, 'assets', 'resumes');
const files = readdirSync(resumeDirectory)
  .filter((name) => /^Anthony-Wohlfeil(?:-[A-Za-z]+)?\.pdf$/.test(name))
  .sort((a, b) => a.localeCompare(b));

const normalize = (value) => value
  .normalize('NFKC')
  .replace(/[‐‑‒–—]/g, '-')
  .replace(/\s+/g, ' ')
  .trim();

const compact = (value) => normalize(value).replace(/\s+/g, '').toLowerCase();
const run = (command, args) => execFileSync(command, args, { encoding: 'utf8' });

const requiredPhrases = [
  'Anthony Wohlfeil',
  'Ann Arbor, MI',
  'anthonywohlfeil@gmail.com',
  'Languages',
  'Java',
  'Python',
  'C/C++',
  'Typescript',
  'SQL',
  'Cloud & Backend',
  'REST APIs',
  'CI/CD pipelines',
  'Docker',
  'Redis',
  'AWS',
  'Datadog',
  'Frameworks & Tools',
  'Spring Boot',
  'React',
  'Git',
  'Computer Vision',
  'LLMs',
  'B.S.E. Computer Engineering',
  'University of Michigan',
  'Sep 2016 - Apr 2020',
  'Software Engineer II',
  'Propio',
  'Feb 2026 - Present',
  'Independent Developer',
  'Self-Employed',
  'Feb 2025 - Jan 2026',
  'Software Development Engineer II',
  'Amazon',
  'Jun 2020 - Feb 2025',
  'Software Engineer',
  'Mcity',
  'Mar 2019 - Jun 2020',
  '~6M',
  '20+',
  '~1.8k',
  '200,000+',
  '120B+',
  '~90%',
  '160M+',
  '99.99%',
  '~200M',
  '4 junior engineers',
  '50+',
  '10,000+'
];

const bulletSentinels = [
  'Redefined alarm and observability infrastructure',
  'Drove cross-team initiatives for PHI redaction strategy',
  'Built a greenfield backend service',
  'Built Resume Revamped',
  'Created a multi-LLM orchestration system',
  'Owned on-call operations for an API platform',
  'Designed, built, and led the migration of a usage metrics data pipeline',
  'Led a large-scale traffic migration within the SP-API control plane',
  'Mentored 4 junior engineers',
  'Trained and evaluated an object detection model',
  'Built and operated an AWS-based video processing pipeline'
];

const jobs = [
  { title: 'Software Engineer II', bullet: bulletSentinels[0] },
  { title: 'Independent Developer', bullet: bulletSentinels[3] },
  { title: 'Software Development Engineer II', bullet: bulletSentinels[5] },
  { title: 'Software Engineer', bullet: bulletSentinels[9] }
];

const requiredUrls = [
  /linkedin\.com\/in\/anthony-wohlfeil\/?/i,
  /github\.com\/Antwohlf/i,
  /anthonywohlfeil\.com\/?/i
];

const failures = [];
const warnings = [];
const rows = [];

if (files.length !== 7) {
  failures.push(`Expected 7 resume PDFs; found ${files.length}.`);
}

for (const file of files) {
  const filePath = path.join(resumeDirectory, file);
  const info = run('pdfinfo', [filePath]);
  const normalText = normalize(run('pdftotext', [filePath, '-']));
  const rawText = normalize(run('pdftotext', ['-raw', filePath, '-']));
  const urls = run('pdfinfo', ['-url', filePath]);
  const searchable = compact(normalText);

  const pageMatch = info.match(/^Pages:\s+(\d+)/m);
  const pages = Number(pageMatch?.[1] ?? 0);
  if (pages !== 1) failures.push(`${file}: expected one page; found ${pages}.`);

  for (const phrase of [...requiredPhrases, ...bulletSentinels]) {
    if (!searchable.includes(compact(phrase))) {
      failures.push(`${file}: missing content “${phrase}”.`);
    }
  }

  if (/40,000\s+food\s+location/i.test(normalText)) {
    failures.push(`${file}: stale 40,000 food-location metric remains.`);
  }

  for (const pattern of requiredUrls) {
    if (!pattern.test(urls)) failures.push(`${file}: missing annotation matching ${pattern}.`);
  }

  const isDefault = file === 'Anthony-Wohlfeil.pdf';
  if (isDefault && !/mailto:anthonywohlfeil@gmail\.com/i.test(urls)) {
    failures.push(`${file}: missing email annotation.`);
  }

  const raw = compact(rawText);
  let cursor = -1;
  let sequential = true;
  for (const job of jobs) {
    const titleIndex = raw.indexOf(compact(job.title), cursor + 1);
    const bulletIndex = raw.indexOf(compact(job.bullet), titleIndex + 1);
    if (titleIndex < 0 || bulletIndex < 0 || bulletIndex <= titleIndex) {
      sequential = false;
      break;
    }
    cursor = bulletIndex;
  }

  if (!sequential) {
    warnings.push(`${file}: raw extraction does not keep each role with its first bullet.`);
  }

  const tagged = /^Tagged:\s+yes$/mi.test(info);
  if (!tagged) warnings.push(`${file}: PDF is untagged; ATS reading order is heuristic.`);

  rows.push({ file, pages, links: (urls.match(/Annotation/g) ?? []).length, sequential, tagged });
}

console.table(rows);
if (warnings.length) {
  console.warn('\nATS warnings:');
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (failures.length) {
  console.error('\nAudit failures:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('\nContent, metric, page-count, and link parity: PASS');
}
