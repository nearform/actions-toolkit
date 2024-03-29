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
    process.env.GITHUB_ACTION = undefined
  })

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'main'
  process.env.GITHUB_ACTION_REPOSITORY = 'nearform/test-repo'
  process.env.GITHUB_ACTION = '__nearform_test-repo'
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
    process.env.GITHUB_ACTION = undefined
  })

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'main'
  process.env.GITHUB_ACTION_REPOSITORY = 'nearform-actions/test-repo'
  process.env.GITHUB_ACTION = '__nearform_actions_test-repo'
  toolkit.logRepoWarning()

  sinon.assert.notCalled(warningStub)
})

test("should print a warning if the composite action is not under the 'nearform-actions' organisation", async ({
  teardown
}) => {
  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
    process.env.GITHUB_ACTION_REPOSITORY = undefined
    process.env.GITHUB_ACTION_PATH = undefined
  })

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'main'
  process.env.GITHUB_ACTION_REPOSITORY = 'actions/github'
  process.env.GITHUB_ACTION_PATH =
    '/home/runner/work/_actions/nearform/name-of-action-repo'
  toolkit.logRepoWarning()

  sinon.assert.calledOnceWithMatch(
    warningStub,
    /The 'name-of-action-repo' action, no longer exists under the 'nearform' organisation.(\n.*)+uses: 'nearform-actions\/name-of-action-repo'/
  )
})

test('should include version number in warning if in path', async ({
  teardown
}) => {
  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
    process.env.GITHUB_ACTION_REPOSITORY = undefined
    process.env.GITHUB_ACTION_PATH = undefined
  })

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'main'
  process.env.GITHUB_ACTION_REPOSITORY = 'actions/github'
  process.env.GITHUB_ACTION_PATH =
    '/home/runner/work/_actions/nearform/name-of-action-repo/v1'
  toolkit.logRepoWarning()

  sinon.assert.calledOnceWithMatch(
    warningStub,
    /The 'name-of-action-repo' action, no longer exists under the 'nearform' organisation.(\n.*)+uses: 'nearform-actions\/name-of-action-repo@v1'/
  )
})

test("should not print a warning if the composite action is under the 'nearform-actions' organisation", async ({
  teardown
}) => {
  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
    process.env.GITHUB_ACTION_REPOSITORY = undefined
    process.env.GITHUB_ACTION_PATH = undefined
  })

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'main'
  process.env.GITHUB_ACTION_REPOSITORY = 'actions/github'
  process.env.GITHUB_ACTION_PATH =
    '/home/runner/work/_actions/nearform-actions/name-of-action-repo/v1'
  toolkit.logRepoWarning()

  sinon.assert.notCalled(warningStub)
})
