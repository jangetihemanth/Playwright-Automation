import fs from 'fs';
import path from 'path';
import type {
  Reporter,
  FullConfig,
  Suite,
  FullResult,
} from '@playwright/test/reporter';

function escapeMarkdown(value: any): string {
  return String(value || '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

class EmployeeStep1SummaryReporter implements Reporter {
  private suite!: Suite;

  onBegin(config: FullConfig, suite: Suite): void {
    this.suite = suite;
  }

  onEnd(result: FullResult): void {
    const tests = this.suite
      .allTests()
      .filter((test) => test.location.file.includes('single-apis-integration'));

    if (tests.length === 0) return;

    const counts = {
      passed: tests.filter((test) => test.outcome() === 'expected').length,
      failed: tests.filter((test) => test.outcome() === 'unexpected').length,
      skipped: tests.filter((test) => test.outcome() === 'skipped').length,
    };

    const lines = [
      '# Employee update-step-1 API - Country-Wise Validation Report',
      '',
      `- Overall Execution Status: **${result.status.toUpperCase()}**`,
      `- Total Scenarios: ${tests.length}`,
      `- Passed: ${counts.passed}`,
      `- Failed: ${counts.failed}`,
      `- Skipped: ${counts.skipped}`,
      '',
      '## Country-Wise Phone Number Validation Matrix',
      '',
      '| Country | Scenario | Phone Tested | Digit Count | Expected | Actual Status | Result | Details |',
      '|---|---|---|---|---|---|---|---|',
    ];

    for (const test of tests) {
      const status = test.outcome() === 'expected' ? 'PASS' : test.outcome().toUpperCase();
      const details = test.annotations
        .filter((annotation) => annotation.type === 'country-validation')
        .map((annotation) => {
          try {
            return JSON.parse(annotation.description || '{}');
          } catch {
            return {};
          }
        });

      const detail = details[details.length - 1] || {};
      const country = detail.country || 'General';
      const scenario = detail.scenario || test.title;
      const phone = detail.phone || '-';
      const digits = detail.digits !== undefined ? detail.digits : '-';
      const expected = detail.expected || (test.title.includes('@positive') ? 'Pass (Valid)' : 'Fail (Reject)');
      const actualStatus = detail.actualStatus || '-';
      const info = detail.message || '-';

      lines.push(
        `| ${escapeMarkdown(country)} | ${escapeMarkdown(scenario)} | \`${escapeMarkdown(phone)}\` | ${escapeMarkdown(digits)} | ${escapeMarkdown(expected)} | ${escapeMarkdown(actualStatus)} | **${status}** | ${escapeMarkdown(info)} |`
      );
    }

    fs.mkdirSync('playwright-report', { recursive: true });
    fs.writeFileSync(
      path.join('playwright-report', 'employee-step1-country-report.md'),
      `${lines.join('\n')}\n`
    );
  }
}

export default EmployeeStep1SummaryReporter;

