import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const output = path.resolve('assets/resumes/Anthony-Wohlfeil-Netflix.pdf');
const fontDirectory = path.resolve('tmp/fonts/static');
mkdirSync(path.dirname(output), { recursive: true });

const fontData = (filename) => readFileSync(path.join(fontDirectory, filename)).toString('base64');
const interRegular = fontData('Inter-Regular.ttf');
const interSemibold = fontData('Inter-SemiBold.ttf');
const interBold = fontData('Inter-Bold.ttf');

const jobs = [
  {
    title: 'Software Engineer II',
    company: 'Propio',
    location: 'Remote',
    dates: 'Feb 2026 - Present',
    bullets: [
      'Redefined alarm and observability infrastructure for a high-throughput video platform serving ~6M calls per week, reducing false alarms and surfacing previously masked failure modes.',
      'Drove cross-team initiatives for PHI redaction strategy of sensitive call data - preventing storage and downstream exposure of sensitive info across API, historical records, and observability pipelines.',
      'Built a greenfield backend service, provisioning cloud infrastructure (AWS CDK) and implementing the core API and service layer to migrate a core voice communication system off a third-party vendor.',
    ],
  },
  {
    title: 'Independent Developer',
    company: 'Self-Employed',
    location: 'Ann Arbor, MI',
    dates: 'Feb 2025 - Jan 2026',
    bullets: [
      'Built Resume Revamped - a resume builder with deterministic rendering and LLM integrations; owned API schema design and data modeling (20+ users, ~1.8k monthly unique visitors).',
      'Created a multi-LLM orchestration system to facilitate web scraping, data enhancement, and data validation for 200,000+ food location entries.',
    ],
  },
  {
    title: 'Software Development Engineer II',
    company: 'Amazon',
    location: 'Detroit, MI',
    dates: 'Jun 2020 - Feb 2025',
    bullets: [
      'Owned on-call operations for an API platform handling 120B+ monthly requests, designing CloudWatch monitoring, autoscaling, and alarm strategies that reduced response times by ~90% during high-severity incidents.',
      'Designed, built, and led the migration of a usage metrics data pipeline (Lambda, Kinesis, S3) processing 160M+ records/hour with 99.99% availability.',
      'Led a large-scale traffic migration within the SP-API control plane, creating and validating new endpoints, executing a safe rollout for ~200M daily requests, and coordinating across multiple international teams.',
      'Mentored 4 junior engineers, including coaching an engineer from intern through mid-level promotion.',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Mcity / University of Michigan',
    location: 'Ann Arbor, MI',
    dates: 'Mar 2019 - Jun 2020',
    bullets: [
      'Trained and evaluated an object detection model and built a custom computer-vision pipeline enabling labeling of 50+ object classes for industry research partners.',
      'Built and operated an AWS-based video processing pipeline (Batch, Lambda, S3), containerizing GPU-accelerated workloads using Docker to automate analysis of 10,000+ hours of autonomous-vehicle footage.',
    ],
  },
];

const icon = (name) => {
  const icons = {
    email: '<path d="M3 5.5h18v13H3z"/><path d="m4 7 8 6 8-6"/>',
    web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    linkedin: '<path d="M5 9v10M5 5.5v.2M10 19v-6c0-2.2 1.2-4 3.6-4 2.2 0 3.4 1.5 3.4 4v6M10 9v10"/>',
    github: '<path d="M8.2 19.5c-4.1 1.2-4.1-2.1-5.8-2.6m11.6 5v-3.1c0-.9.1-1.5-.4-2 3.2-.4 6.6-1.6 6.6-7.1 0-1.6-.6-2.9-1.5-3.9.2-.4.7-1.9-.1-3.8 0 0-1.2-.4-4 1.5a13.5 13.5 0 0 0-7.2 0C4.6 1.6 3.4 2 3.4 2c-.8 1.9-.3 3.4-.1 3.8-.9 1-1.5 2.3-1.5 3.9 0 5.5 3.4 6.7 6.6 7.1-.4.4-.8 1.1-.8 2.1V22"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
};

const links = [
  ['email', 'Email', 'mailto:anthonywohlfeil@gmail.com'],
  ['web', 'Personal website', 'https://anthonywohlfeil.com/'],
  ['linkedin', 'LinkedIn', 'https://linkedin.com/in/anthony-wohlfeil'],
  ['github', 'GitHub', 'https://github.com/Antwohlf'],
];
const iconLinks = links.filter(([name]) => name !== 'email');

const impactMetrics = [
  '~6M calls per week',
  '200,000+ food location entries',
  '120B+ monthly requests',
  '~90%',
  '160M+ records/hour',
  '99.99% availability',
  '~200M daily requests',
  '4 junior engineers',
  '50+ object classes',
  '10,000+ hours',
];

const emphasizeImpact = (text) => impactMetrics.reduce(
  (result, metric) => result.replace(metric, `<span class="impact">${metric}</span>`),
  text,
);

const jobMarkup = jobs.map((job, index) => `
  <article class="episode episode-${index + 1}${index === 0 ? ' is-current' : ''}">
    <div class="episode-number">${index === 0 ? '<span>CURRENT</span>' : ''}${String(index + 1).padStart(2, '0')}</div>
    <div class="episode-copy">
      <header class="episode-header">
        <div>
          <h3>${job.title}</h3>
          <p><span class="company">${job.company}</span><span>${job.location}</span></p>
        </div>
        <time>${job.dates}</time>
      </header>
      <ul>${job.bullets.map((bullet) => `<li>${emphasizeImpact(bullet)}</li>`).join('')}</ul>
    </div>
  </article>`).join('');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Anthony Wohlfeil - Netflix Resume</title>
  <style>
    @font-face { font-family: Inter; src: url(data:font/ttf;base64,${interRegular}); font-weight: 400; }
    @font-face { font-family: Inter; src: url(data:font/ttf;base64,${interSemibold}); font-weight: 600; }
    @font-face { font-family: Inter; src: url(data:font/ttf;base64,${interBold}); font-weight: 700; }
    @page { size: letter; margin: 0; }
    * { box-sizing: border-box; }
    html, body { width: 8.5in; height: 11in; margin: 0; overflow: hidden; }
    body { color: #f5f5f1; background: #0b0b0b; font-family: Inter, Arial, sans-serif; }
    a { color: inherit; text-decoration: none; }
    .page {
      width: 8.5in;
      height: 11in;
      padding: 22px 34px 26px;
      overflow: hidden;
      background:
        radial-gradient(circle at 82% 5%, rgba(229, 9, 20, .16), transparent 24%),
        linear-gradient(180deg, #141414 0, #0b0b0b 25%, #0b0b0b 100%);
    }
    .topbar { height: 53px; display: flex; align-items: center; border-bottom: 1px solid #2a2a2a; }
    .n-mark { width: 18px; height: 31px; flex: 0 0 auto; margin-right: 24px; }
    .n-mark svg { display: block; width: 100%; height: 100%; }
    .nav { display: flex; align-items: center; gap: 17px; color: #aaa; font-size: 8.8px; font-weight: 600; }
    .nav .active { padding: 5px 9px; color: #111; background: #f5f5f1; border-radius: 14px; }
    .profile-links { display: flex; gap: 7px; margin-left: auto; }
    .profile-link {
      position: relative; width: 48px; height: 48px; display: grid; place-items: center;
      color: #b3b3b3;
    }
    .profile-link::before { content: ''; position: absolute; width: 36px; height: 36px; border: 1px solid #3c3c3c; border-radius: 50%; }
    .profile-link svg { position: relative; width: 13px; height: 13px; fill: none; stroke: currentColor; stroke-width: 1.65; stroke-linecap: round; stroke-linejoin: round; }
    .hero { min-height: 145px; display: grid; grid-template-columns: minmax(0, 1fr) 265px; gap: 24px; align-items: center; position: relative; }
    .hero::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: #333; }
    .hero-copy { padding: 16px 0 18px; position: relative; z-index: 1; }
    .series-label { margin: 0 0 5px; color: #b3b3b3; font-size: 7.2px; font-weight: 700; letter-spacing: 2.4px; }
    h1 { margin: 0; font-size: 35px; line-height: 1; letter-spacing: -1.2px; }
    .role { margin: 7px 0 0; color: #fff; font-size: 13px; font-weight: 600; }
    .contact-email { margin: 9px 0 0; color: #fff; font-size: 8.8px; font-weight: 600; }
    .metadata { display: flex; align-items: center; gap: 9px; margin: 5px 0 0; color: #b3b3b3; font-size: 8.2px; }
    .match { color: #fff; font-weight: 600; }
    .metadata span + span::before { content: '•'; margin-right: 9px; color: #555; }
    .hero-stats { position: relative; z-index: 1; padding: 12px 0 10px 18px; border-left: 1px solid #444; }
    .featured-metric .metric-value { display: block; color: #fff; font-size: 25px; font-weight: 700; line-height: 1; }
    .featured-metric .metric-label { display: block; margin-top: 5px; color: #b3b3b3; font-size: 8px; }
    .secondary-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 13px; padding-top: 9px; border-top: 1px solid #333; }
    .secondary-metric { margin: 0; }
    .secondary-metric .metric-value { display: block; color: #e5e5e5; font-size: 10px; font-weight: 700; line-height: 1; }
    .secondary-metric .metric-label { display: block; margin-top: 4px; color: #8f8f8f; font-size: 6.2px; line-height: 1.2; }
    .rail-heading { height: 27px; display: flex; align-items: end; gap: 9px; padding-bottom: 6px; }
    .rail-heading h2 { margin: 0; font-size: 12px; line-height: 1; }
    .rail-heading span { color: #777; font-size: 7.3px; }
    .skill-rail { display: grid; grid-template-columns: 1.05fr 1.45fr 1.25fr 1.25fr; gap: 7px; }
    .skill-tile { min-height: 69px; padding: 10px 10px; background: linear-gradient(145deg, #242424, #171717); border-radius: 3px; }
    .skill-tile h3 { margin: 0 0 6px; color: #fff; font-size: 8px; letter-spacing: .7px; text-transform: uppercase; }
    .skill-tile p { margin: 0; color: #d2d2d2; font-size: 10px; line-height: 1.35; }
    .skill-tile.education { background: linear-gradient(145deg, #242424, #171717); }
    .skill-tile.education .strong { color: #fff; font-weight: 600; }
    .experience-heading { height: 38px; display: flex; align-items: end; padding: 0 0 8px; border-bottom: 1px solid #2c2c2c; }
    .experience-heading h2 { margin: 0; font-size: 13px; }
    .experience-heading p { margin: 0 0 1px auto; color: #777; font-size: 7.5px; }
    .episodes { display: grid; gap: 6px; padding-top: 6px; }
    .episode { position: relative; display: block; background: #141414; border-bottom: 1px solid #292929; overflow: hidden; }
    .episode.is-current { background: linear-gradient(90deg, #242424, #1d1d1d); border: 1px solid #d5d5d1; border-radius: 3px; }
    .episode-number { position: absolute; inset: 0 auto 0 0; width: 52px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #777; border-right: 1px solid #333; font-size: 16px; font-weight: 700; letter-spacing: -.4px; }
    .is-current .episode-number { color: #fff; }
    .episode-number span { margin-bottom: 3px; color: #777; font-size: 5.6px; font-weight: 700; letter-spacing: .8px; }
    .episode-number::after { content: ''; width: 25px; height: 2px; margin-top: 6px; background: #444; }
    .is-current .episode-number::after { background: linear-gradient(90deg, #e50914 0 82%, #555 82% 100%); }
    .episode-copy { min-width: 0; margin-left: 52px; padding: 10px 13px; }
    .episode-header { display: flex; gap: 12px; align-items: flex-start; }
    .episode-header h3 { margin: 0; color: #fff; font-size: 11.3px; line-height: 1.05; }
    .episode-header p { display: flex; gap: 7px; margin: 3px 0 0; color: #aaa; font-size: 9.2px; }
    .episode-header p .company { color: #e2e2e2; font-weight: 600; }
    .episode-header p span + span::before { content: '•'; margin-right: 7px; color: #555; }
    .episode time { margin-left: auto; color: #aaa; font-size: 9.2px; white-space: nowrap; }
    .episode ul { display: block; margin: 8px 0 0; padding: 0; list-style: none; color: #e1e1e1; font-size: 10.5px; line-height: 1.27; }
    .episode li { position: relative; padding-left: 10px; }
    .episode li + li { margin-top: 4px; }
    .episode li::before { content: ''; position: absolute; left: 0; top: 4.5px; width: 3px; height: 3px; background: #666; }
    .is-current li::before { background: #e50914; }
    .impact { color: #fff; font-weight: 600; }
    .episode-1 { min-height: 155px; }
    .episode-2 { min-height: 122px; }
    .episode-3 { min-height: 190px; }
    .episode-4 { min-height: 135px; }
  </style>
</head>
<body>
  <main class="page">
    <header class="topbar">
      <div class="n-mark" aria-label="Netflix-inspired profile">
        <svg viewBox="0 0 28 48" role="img" aria-hidden="true">
          <path fill="#b20710" d="M2 0h8v48H2zM18 0h8v48h-8z"/>
          <path fill="#e50914" d="M2 0h8l16 48h-8z"/>
        </svg>
      </div>
      <nav class="nav" aria-label="Resume sections">
        <span class="active">Overview</span><span>Experience</span><span>Skills</span><span>Education</span>
      </nav>
      <div class="profile-links">
        ${iconLinks.map(([name, label, href]) => `<a class="profile-link" href="${href}" aria-label="${label}" title="${label}">${icon(name)}</a>`).join('')}
      </div>
    </header>

    <section class="hero">
      <div class="hero-copy">
        <p class="series-label">PROFESSIONAL PROFILE</p>
        <h1>Anthony Wohlfeil</h1>
        <p class="role">Software Engineer</p>
        <p class="contact-email"><a href="mailto:anthonywohlfeil@gmail.com">anthonywohlfeil@gmail.com</a></p>
        <p class="metadata"><span>Ann Arbor, MI</span><span>B.S.E. Computer Engineering</span><span>Engineering since 2019</span></p>
      </div>
      <div class="hero-stats" aria-label="Selected impact">
        <div class="featured-metric"><span class="metric-value">120B+</span><span class="metric-label">monthly API requests supported</span></div>
        <div class="secondary-metrics">
          <p class="secondary-metric"><span class="metric-value">~6M</span><span class="metric-label">calls / week</span></p>
          <p class="secondary-metric"><span class="metric-value">160M+</span><span class="metric-label">records / hour</span></p>
          <p class="secondary-metric"><span class="metric-value">200,000+</span><span class="metric-label">food locations</span></p>
        </div>
      </div>
    </section>

    <section aria-labelledby="skills-heading">
      <div class="rail-heading"><h2 id="skills-heading">Skills &amp; Education</h2></div>
      <div class="skill-rail">
        <article class="skill-tile"><h3>Languages</h3><p>Java, Python, C/C++, TypeScript, SQL</p></article>
        <article class="skill-tile"><h3>Cloud &amp; Backend</h3><p>REST APIs, CI/CD pipelines, Docker, Redis, AWS, Datadog</p></article>
        <article class="skill-tile"><h3>Frameworks &amp; Tools</h3><p>Spring Boot, React, Git, Computer Vision, LLMs</p></article>
        <article class="skill-tile education"><h3>Education</h3><p><span class="strong">B.S.E. Computer Engineering</span><br>University of Michigan<br>Sep 2016 - Apr 2020</p></article>
      </div>
    </section>

    <section aria-labelledby="experience-heading">
      <header class="experience-heading"><h2 id="experience-heading">Experience</h2><p>4 roles • 2019 - Present</p></header>
      <div class="episodes">${jobMarkup}</div>
    </section>
  </main>
</body>
</html>`;

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  const overflow = await page.evaluate(() => ({
    pageHeight: document.querySelector('.page').getBoundingClientRect().height,
    contentHeight: document.querySelector('.page').scrollHeight,
    bodyWidth: document.body.scrollWidth,
  }));
  if (overflow.contentHeight > overflow.pageHeight + 1 || overflow.bodyWidth > 816) {
    throw new Error(`Netflix resume overflowed: ${JSON.stringify(overflow)}`);
  }

  await page.pdf({
    path: output,
    width: '8.5in',
    height: '11in',
    printBackground: true,
    tagged: true,
    outline: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
} finally {
  await browser.close();
}

const pdfInfo = execFileSync('pdfinfo', [output], { encoding: 'utf8' });
const pdfText = execFileSync('pdftotext', [output, '-'], { encoding: 'utf8' });
const pdfUrls = execFileSync('pdfinfo', ['-url', output], { encoding: 'utf8' });
const normalizedPdfText = pdfText.replace(/\s+/g, ' ');

if (!/^Pages:\s+1$/m.test(pdfInfo) || !/^Page size:\s+612 x 792 pts \(letter\)$/m.test(pdfInfo)) {
  throw new Error('Netflix resume must be exactly one US Letter page.');
}

for (const requiredText of [
  'Anthony Wohlfeil',
  'Software Engineer II',
  'Independent Developer',
  'Software Development Engineer II',
  '200,000+ food location entries',
  'B.S.E. Computer Engineering',
]) {
  if (!normalizedPdfText.includes(requiredText)) throw new Error(`Missing PDF text: ${requiredText}`);
}

for (const requiredUrl of links.map(([, , href]) => href)) {
  if (!pdfUrls.includes(requiredUrl)) throw new Error(`Missing PDF link: ${requiredUrl}`);
}
