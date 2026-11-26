import fs from 'fs';
import path from 'path';
import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';

function escapeMarkdown(value: any): string {
  return String(value || '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

class UsersSummaryReporter implements Reporter {
  private suite!: Suite;

  onBegin(config: FullConfig, suite: Suite): void {
    this.suite = suite;
  }

  onEnd(result: FullResult): void {
    const tests = this.suite
      .allTests()
      .filter((test) => test.location.file.includes(`${path.sep}users${path.sep}`));
    const counts = {
      passed: tests.filter((test) => test.outcome() === 'expected').length,
      failed: tests.filter((test) => test.outcome() === 'unexpected').length,
      skipped: tests.filter((test) => test.outcome() === 'skipped').length,
    };
    const lines = [
      '# Users API Test Report',
      '',
      `- Overall result: **${result.status.toUpperCase()}**`,
      `- Total: ${tests.length}`,
      `- Passed: ${counts.passed}`,
      `- Failed: ${counts.failed}`,
      `- Skipped: ${counts.skipped}`,
      '',
      '## Case Details',
      '',
      '| Result | Test case | Request and expectation | Actual response | Failure reason |',
      '|---|---|---|---|---|',
    ];

    for (const test of tests) {
      const latestResult = test.results[test.results.length - 1];
      const status =
        test.outcome() === 'expected' ? 'PASS' : test.outcome().toUpperCase();
      const details = test.annotations
        .filter((annotation) => annotation.type === 'api-details')
        .map((annotation) => JSON.parse(annotation.description || '{}'));
      const detail = details[details.length - 1] || {};
      const request = detail.request
        ? `Payload: ${JSON.stringify(detail.request)}`
        : 'Not executed';
      const expectation = detail.expected ? `Expected: ${detail.expected}` : '';
      const actual = detail.actualStatus
        ? `Status: ${detail.actualStatus}<br>Body: ${detail.responseBody || '(empty)'}`
        : 'No response';
      const reason =
        latestResult?.errors?.map((error) => error.message?.split('\n')[0]).join('<br>') ||
        detail.reason ||
        '';
      lines.push(
        `| ${status} | ${escapeMarkdown(test.title)} | ${escapeMarkdown(
          `${request}<br>${expectation}`
        )} | ${escapeMarkdown(actual)} | ${escapeMarkdown(reason)} |`
      );
    }

    fs.mkdirSync('playwright-report', { recursive: true });
    fs.writeFileSync(
      path.join('playwright-report', 'users-api-summary.md'),
      `${lines.join('\n')}\n`
    );
  }
}

export default UsersSummaryReporter;
