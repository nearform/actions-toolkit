'use strict'

const { test } = require('tap')
const { getActionRefWarning } = require('../src/core')

test('should return warning if actionRef is master', async ({
  equal,
  plan,
  teardown
}) => {
  plan(1)

  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
  })

  process.env.GITHUB_ACTION_REF = 'master'
  const warning = getActionRefWarning('nearform/test-repo')

  const warningText =
    `nearform/test-repo is pinned at HEAD. We strongly ` +
    `advise against pinning to "@master" as it may be unstable. Please ` +
    `update your GitHub Action YAML from:\n\n` +
    `    uses: 'nearform/test-repo@master'\n\n` +
    `to:\n\n` +
    `    uses: 'nearform/test-repo@<release/tag version>'\n\n` +
    `Alternatively, you can pin to any git tag or git SHA in the ` +
    `repository.`

  equal(warning, warningText)
})

test('should return warning if actionRef is main', async ({
  equal,
  plan,
  teardown
}) => {
  plan(1)

  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
  })

  process.env.GITHUB_ACTION_REF = 'main'
  const warning = getActionRefWarning('nearform/test-repo')

  const warningText =
    `nearform/test-repo is pinned at HEAD. We strongly ` +
    `advise against pinning to "@master" as it may be unstable. Please ` +
    `update your GitHub Action YAML from:\n\n` +
    `    uses: 'nearform/test-repo@master'\n\n` +
    `to:\n\n` +
    `    uses: 'nearform/test-repo@<release/tag version>'\n\n` +
    `Alternatively, you can pin to any git tag or git SHA in the ` +
    `repository.`

  equal(warning, warningText)
})

test('should return null if actionRef is not main or master', async ({
  equal,
  plan,
  teardown
}) => {
  plan(1)

  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
  })

  process.env.GITHUB_ACTION_REF = 'feat-test'
  const warning = getActionRefWarning('nearform/test-repo')

  equal(warning, null)
})
