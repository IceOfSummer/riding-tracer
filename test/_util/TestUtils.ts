import { expect } from '@jest/globals'

/**
 * 将对象视作非空
 */
export function test_expectNonNull(val: unknown): asserts val {
  expect(val).not.toBeNull()
}