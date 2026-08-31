import fs from 'node:fs';
import path from 'node:path';

const junitPath = path.resolve('reports/junit/results.xml');
const outputDirectory = path.resolve('reports/quality');

if (!fs.existsSync(junitPath)) {
  console.error(`JUnit report not found: ${junitPath}`);
  process.exit(1);
}

const xml = fs.readFileSync(junitPath, 'utf-8');

const testsuitesMatch = xml.match(/<testsuites\b([^>]*)>/);

if (!testsuitesMatch) {
  console.error('Unable to find <testsuites> in JUnit report.');
  process.exit(1);
}

const attributes = testsuitesMatch[1];

function getAttribute(name) {
  const match = attributes.match(
    new RegExp(`\\b${name}="([^"]*)"`)
  );

  return match ? match[1] : undefined;
}

const total = Number(getAttribute('tests') ?? 0);
const failures = Number(getAttribute('failures') ?? 0);
const skipped = Number(getAttribute('skipped') ?? 0);
const errors = Number(getAttribute('errors') ?? 0);
const durationSeconds = Number(getAttribute('time') ?? 0);

const passed = Math.max(
  total - failures - skipped - errors,
  0
);

const passRate =
  total > 0
    ? Number(((passed / total) * 100).toFixed(2))
    : 0;

const status =
  failures === 0 && errors === 0
    ? 'PASSED'
    : 'FAILED';

const metrics = {
  generatedAt: new Date().toISOString(),
  source: 'reports/junit/results.xml',
  total,
  passed,
  failed: failures,
  errors,
  skipped,
  passRate,
  durationSeconds: Number(durationSeconds.toFixed(2)),
  status,
};

fs.mkdirSync(outputDirectory, { recursive: true });

const jsonPath = path.join(
  outputDirectory,
  'quality-metrics.json'
);

fs.writeFileSync(
  jsonPath,
  JSON.stringify(metrics, null, 2),
  'utf-8'
);

const markdown = `# API Quality Metrics

| Metric | Value |
| --- | ---: |
| Total | ${metrics.total} |
| Passed | ${metrics.passed} |
| Failed | ${metrics.failed} |
| Errors | ${metrics.errors} |
| Skipped | ${metrics.skipped} |
| Pass Rate | ${metrics.passRate}% |
| Duration | ${metrics.durationSeconds}s |
| Status | ${metrics.status} |

Generated from \`${metrics.source}\`.
`;

const markdownPath = path.join(
  outputDirectory,
  'quality-summary.md'
);

fs.writeFileSync(
  markdownPath,
  markdown,
  'utf-8'
);

console.log('');
console.log('API QUALITY METRICS');
console.log('-------------------');
console.log(`Total:     ${metrics.total}`);
console.log(`Passed:    ${metrics.passed}`);
console.log(`Failed:    ${metrics.failed}`);
console.log(`Errors:    ${metrics.errors}`);
console.log(`Skipped:   ${metrics.skipped}`);
console.log(`Pass Rate: ${metrics.passRate}%`);
console.log(`Duration:  ${metrics.durationSeconds}s`);
console.log(`Status:    ${metrics.status}`);
console.log('');
console.log(`JSON: ${jsonPath}`);
console.log(`Markdown: ${markdownPath}`);