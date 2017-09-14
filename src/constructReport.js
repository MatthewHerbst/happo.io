import colors from 'colors/safe';

import getReport from './getReport';

function printSummary(summary) {
  Object.keys(summary.snapshots).forEach((file) => {
    const variants = summary.snapshots[file];
    console.log(file);
    Object.keys(variants).forEach((variant) => {
      const targets = summary.snapshots[file][variant];
      Object.keys(targets).forEach((target) => {
        console.log(`  ${variant}@${target}`);
        const { oldUrl, url } = summary.snapshots[file][variant][target];
        if (oldUrl) {
          console.log(colors.red(`    - ${oldUrl}`));
        }
        if (url) {
          console.log(colors.cyan(`    + ${url}`));
        }
      });
    })
  });

  console.log('================================');
  console.log(`Total number of snapshots: ${summary.counts.total}`);
  console.log(colors.red(`✗ ${summary.counts.diffs} diffs`));
  console.log(colors.cyan(`+ ${summary.counts.additions} new snapshots`));
  console.log(colors.green(`✓ ${summary.counts.equals} unchanged snapshots`));

}

export default function constructReport(results) {
  const currentReport = getReport();

  const summary = {
    allGreen: true,
    counts: {
      diffs: 0,
      additions: 0,
      equals: 0,
      total: 0,
    },
    snapshots: {}
  };

  results.forEach(({name: targetName, result}) => {
    result.forEach(({ name, file, url }) => {

      summary.counts.total++;

      if (!currentReport[file]) currentReport[file] = {};
      if (!currentReport[file][name]) currentReport[file][name] = {};

      const oldUrl = currentReport[file][name][targetName];
      if (oldUrl === url) {
        summary.counts.equals++;
        return;
      }

      summary.allGreen = false;

      if (!summary.snapshots[file]) summary.snapshots[file] = {};
      if (!summary.snapshots[file][name]) summary.snapshots[file][name] = {};

      if (!oldUrl) {
        currentReport[file][name][targetName] = url;
        summary.snapshots[file][name][targetName] = { url };
        summary.counts.additions++;
      } else if (oldUrl !== url) {
        currentReport[file][name][targetName] = url;
        summary.snapshots[file][name][targetName] = { oldUrl, url };
        summary.counts.diffs++;
      }
    });
  });

  printSummary(summary);
  return { report: currentReport, summary };
}
