
// sampple code from https://jestjs.io/docs/getting-started
const sum = require('./sample')

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

test('adds 1 + 2 to equal 3', () => {
  expect(sum(2, 3)).not.toBe(3)
})
