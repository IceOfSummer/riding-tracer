export const toClassnames = (...classnames: Array<string | undefined | null>): string => {
  return classnames.filter(val => !!val).join(' ')
}