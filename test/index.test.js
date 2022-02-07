'use strict'

const { test } = require('tap')
const { getActionRefWarning } = require('../src')

test('should return warning if actionRef is master', async ({
  match,
  plan,
  teardown
}) => {
  plan(1)

  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
  })

  process.env.GITHUB_ACTION_REF = 'master'
  const warning = getActionRefWarning('nearform/test-repo')

  match(warning, /nearform\/test-repo is pinned at HEAD/)
})

test('should return warning if actionRef is main', async ({
  match,
  plan,
  teardown
}) => {
  plan(1)

  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
  })

  process.env.GITHUB_ACTION_REF = 'main'
  const warning = getActionRefWarning('nearform/test-repo')

  match(warning, /nearform\/test-repo is pinned at HEAD/)
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

test('should return null if invalid repoName', async ({ equal, plan }) => {
  plan(1)

  const warning = getActionRefWarning('')

  equal(warning, null)
})
