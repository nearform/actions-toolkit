'use strict'

const { test } = require('tap')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const setup = () => {
  const warningStub = sinon.stub()
  const toolkit = proxyquire('../src/index', {
    '@actions/core': {
      warning: warningStub
    }
  })

  return { toolkit, warningStub }
}

test('should return warning if actionRef is master', async ({
  match,
  plan,
  teardown
}) => {
  plan(1)

  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
  })

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'master'
  toolkit.displayActionRefWarning('nearform/test-repo')

  match(warningStub.args[0], /nearform\/test-repo is pinned at HEAD/)
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

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'main'
  toolkit.displayActionRefWarning('nearform/test-repo')

  match(warningStub.args[0], /nearform\/test-repo is pinned at HEAD/)
})

test('should not print warning if actionRef is not main or master', async ({
  equal,
  plan,
  teardown
}) => {
  plan(1)

  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
  })

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'feat-test'
  toolkit.displayActionRefWarning('nearform/test-repo')

  equal(warningStub.called, false)
})

test('should print generic warning if invalid repoName', async ({
  plan,
  match
}) => {
  plan(1)

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'main'
  toolkit.displayActionRefWarning()

  match(warningStub.args[0], /Repository is pinned at HEAD/)
})
