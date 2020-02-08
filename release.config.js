const czConfig = require('./.cz-config');

const releaseRules = [
  { type: 'docs', scope: 'README', release: 'patch' },
  { type: 'feat', release: 'minor' },
  { type: 'fix', release: 'patch' },
  { type: 'style', release: 'patch' },
  { type: 'refactor', release: 'patch' },
  { type: 'perf', release: 'patch' },
  { type: 'improvement', release: 'patch' },
  { type: 'chore', release: null }
];

const releaseRulesArray = releaseRules.map(x => x.type);

// 对于没有定义在releaseRules里的type 默认设置其发布版本为 patch
czConfig.types.forEach(x => {
  if (releaseRulesArray.indexOf(x.value) < 0) {
    releaseRules.push({
      type: x.value,
      release: 'patch'
    });
  }
});

module.exports = {
  debug: true,
  branch: 'master',
  dryRun: false,
  preset: 'angular',
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: releaseRules,
        parserOpts: {
          // mergePattern: 'Merged PR .*:',
          // the commits that contains BREAKING CHANGE or BREAKING CHANGES in their body will be considered breaking changes.
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES']
        }
      }
    ],
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md'
      }
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        pkgRoot: 'dist',
        allowSameVersion: true
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'],
        message:
          'chore(🤖):${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ],
    [
      '@semantic-release/github',
      {
        // assets: 'dist/!*.tgz'
      }
    ]
  ]
};
