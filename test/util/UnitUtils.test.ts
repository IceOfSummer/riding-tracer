import { test, expect } from '@jest/globals'
import { formatDate, formatDistance, formatTime } from '~/util/UnitUtils'


test('Test Time Format', () => {
  expect(formatTime(30)).toBe('30s')
  expect(formatTime(60 + 30)).toBe('1m30s')
  expect(formatTime(60 + 3600)).toBe('1h1m0s')
  expect(formatTime(1 + 60 + 3600)).toBe('1h1m1s')

  expect(formatTime(10.010002)).toBe('10s')
  expect(formatTime(10.010002 + 60)).toBe('1m10s')
})


test('Test Distance Format', () => {
  expect(formatDistance(1002)).toBe('1.00km')
  expect(formatDistance(1020)).toBe('1.02km')
  expect(formatDistance(1009)).toBe('1.01km')
  expect(formatDistance(900)).toBe('900m')
  expect(formatDistance(900.9)).toBe('901m')
})


test('Test Date Format', () => {
  const current = new Date(2024, 4, 5, 13, 0, 0, 0)
  expect(formatDate(new Date(2024, 4, 5, 12, 50, 0, 0), current)).toBe('10分钟前')
  expect(formatDate(new Date(2024, 4, 5, 12, 0, 0, 0), current)).toBe('1小时前')
  expect(formatDate(new Date(2024, 4, 4, 13, 0, 0, 0), current)).toBe('1天前')
  expect(formatDate(new Date(2024, 4, 4, 12, 0, 0, 0), current)).toBe('1天1小时前')
  expect(formatDate(new Date(2024, 3, 5, 13, 0, 0, 0), current)).toBe('30天前')
})