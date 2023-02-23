'use strict'

const { test } = require('tap')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const setup = () => {
  const infoStub = sinon.stub()
  const warningStub = sinon.stub()

  const toolkit = proxyquire('../src/index', {
    '@actions/core': {
      info: infoStub,
      warning: warningStub
    }
  })

  return { toolkit, infoStub, warningStub }
}

test('should return warning if actionRef is master', async ({ teardown }) => {
  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
    process.env.GITHUB_ACTION_REPOSITORY = undefined
  })

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'master'
  process.env.GITHUB_ACTION_REPOSITORY = 'nearform/test-repo'
  toolkit.logActionRefWarning()

  sinon.assert.calledOnceWithMatch(
    warningStub,
    /nearform\/test-repo is pinned at HEAD/
  )
})

test('should return warning if actionRef is main', async ({ teardown }) => {
  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
    process.env.GITHUB_ACTION_REPOSITORY = undefined
  })

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'main'
  process.env.GITHUB_ACTION_REPOSITORY = 'nearform/test-repo'
  toolkit.logActionRefWarning()

  sinon.assert.calledOnceWithMatch(
    warningStub,
    /nearform\/test-repo is pinned at HEAD/
  )
})

test('should not print warning if actionRef is not main or master', async ({
  teardown
}) => {
  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
    process.env.GITHUB_ACTION_REPOSITORY = undefined
  })

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'feat-test'
  process.env.GITHUB_ACTION_REPOSITORY = 'nearform/test-repo'
  toolkit.logActionRefWarning()

  sinon.assert.notCalled(warningStub)
})

test("should print a warning if the reusable workflow is not under the 'nearform-actions' organisation", async ({
  teardown
}) => {
  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
    process.env.GITHUB_ACTION_REPOSITORY = undefined
  })

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'main'
  process.env.GITHUB_ACTION_REPOSITORY = 'nearform/test-repo'
  toolkit.logRepoWarning()

  sinon.assert.calledOnceWithMatch(
    warningStub,
    /The 'test-repo' action, no longer exists under the 'nearform' organisation./
  )
})

test("should not print a warning if the reusable workflow is under the 'nearform-actions' organisation", async ({
  teardown
}) => {
  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
    process.env.GITHUB_ACTION_REPOSITORY = undefined
  })

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'main'
  process.env.GITHUB_ACTION_REPOSITORY = 'nearform-actions/test-repo'
  toolkit.logRepoWarning()

  sinon.assert.notCalled(warningStub)
})

test('should print an info message if we cannot establish the action origin', async ({
  teardown
}) => {
  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
    process.env.GITHUB_ACTION_REPOSITORY = undefined
  })

  const { toolkit, infoStub } = setup()

  process.env.GITHUB_ACTION_REF = 'main'
  process.env.GITHUB_ACTION_REPOSITORY = 'actions/github'
  toolkit.logRepoWarning()

  sinon.assert.calledOnceWithMatch(
    infoStub,
    /Could not establish if the action was a NearForm supported action/
  )
})
