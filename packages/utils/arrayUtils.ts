/**
 * 連想配列のソート（降順）用の比較関数
 * @param key
 */
const asc = (key: string): ((item1: { [key: string]: any }, item2: { [key: string]: any }) => number) => {
  return (item1, item2) => {
    if (item1[key] < item2[key]) {
      return -1
    }
    if (item1[key] > item2[key]) {
      return 1
    }
    return 0
  }
}

/**
 * 連想配列のソート（降順）用の比較関数
 * @param key
 */
const desc = (key: string): ((item1: { [key: string]: any }, item2: { [key: string]: any }) => number) => {
  return (item1, item2) => {
    if (item1[key] > item2[key]) {
      return -1
    }
    if (item1[key] < item2[key]) {
      return 1
    }
    return 0
  }
}

/**
 * ソート用の比較関数
 */
export const order = {
  asc,
  desc
}

/**
 * 重複排除
 */
export const distinct = <T>(values?: T[]) => {
  if (!values || !values.length) {
    return []
  }
  const set = new Set(values)
  return [...set]
}

/**
 * 配列を指定したサイズごとに分割
 *
 * @param values
 * @param size
 */
export const splitArray = <T>(values: T[], size: number): [T[]] => {
  let resultIndex = 0
  const result: [T[]] = [[]]
  for (const value of values) {
    if (result[resultIndex].length === size) {
      result.push([])
      resultIndex++
    }
    result[resultIndex].push(value)
  }
  return result
}
