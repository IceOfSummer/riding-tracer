import { expect } from '@jest/globals'

/**
 * 将对象视作非空
 */
export function test_expectNonNull(val: unknown): asserts val {
  expect(val).not.toBeNull()
}

/**
 * 比较浮点数
 * @param v1 第一个数
 * @param v2 第二个数
 * @param accuracy 精度，越小表示对结果要求更严格, 必须是正数
 */
export function test_floatEqual(v1: number, v2: number, accuracy = 0.1) {
  expect(Math.abs(v1 - v2)).toBeLessThan(accuracy)
}