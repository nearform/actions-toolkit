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
  })

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'master'
  toolkit.logActionRefWarning('nearform/test-repo')

  sinon.assert.calledOnceWithMatch(
    warningStub,
    /nearform\/test-repo is pinned at HEAD/
  )
})

test('should return warning if actionRef is main', async ({ teardown }) => {
  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
  })

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'main'
  toolkit.logActionRefWarning('nearform/test-repo')

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
  })

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'feat-test'
  toolkit.logActionRefWarning('nearform/test-repo')

  sinon.assert.notCalled(warningStub)
})

test('should print generic warning if invalid repoName', async () => {
  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'main'
  toolkit.logActionRefWarning()

  sinon.assert.calledOnceWithMatch(warningStub, /Repository is pinned at HEAD/)
})
