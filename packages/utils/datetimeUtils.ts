import * as moment from 'moment'

export enum DateFormat {
  DATE = 'YYYY-MM-DD',
  DATE_TIME = 'YYYY-MM-DD HH:mm:ss+00:00',
  DATE_SLASH = 'YYYY/M/D',
  DATE_JA = 'YYYY年M月D日',
  DATE_TIME_JA = 'YYYY年M月D日 HH:mm:ss',
  DATE_TIME_SLASH = 'YYYY/M/D HH:mm',
  MONTH_DATE_SLASH = 'M/D',
  MONTH_DATE_TIME_SLASH = 'M/D HH:mm',
  MONTH_DATE_WEAK_SLASH = 'M/D(ddd)',
  HOUR_OF_DAY = 'YYYY-MM-DDTHH',
  TIME = 'HH:mm:ss.SSSZ',
  MINUTES = 'mm:ss.SSSZ',
  YEAR = 'YYYY',
  YEAR_JA = 'YYYY年',
  MONTH = 'MM',
  MONTH_JA = 'M月',
  YEAR_MONTH = 'YYYY-MM',
  YEAR_MONTH_JA = 'YYYY年M月',
  RFC3339 = 'YYYY-MM-DDTHH:mm:ss+0000',
  RFC3339JST = 'YYYY-MM-DDTHH:mm:ss+0900',
  PUB_DATE_JST = 'ddd, DD MMM YYYY HH:mm:ss +0900',
  WEEKDAY = 'dddd'
}

/**
 * datetimeFormat
 * datetimeが空の場合は現在時刻で返す
 * @param datetime
 * @param format
 * @returns {string}
 */
export const formatDatetime = (datetime: any, format: DateFormat): string => {
  if (!datetime) {
    return moment().utc().format(format)
  }

  return moment(datetime).utc().format(format)
}

export const displayDate = (datetime: string) => {
  const targetDate = moment(datetime).utc()
  const diffDate = moment().utc().diff(targetDate, 'hours')
  if (diffDate <= 1) {
    return `${moment().utc().diff(targetDate, 'minutes')}分前`
  }
  if (diffDate <= 23) {
    return `${diffDate}時間前`
  }
  if (diffDate >= 24 && diffDate <= 47) {
    return '1日前'
  }
  if (diffDate >= 48 && diffDate <= 72) {
    return '1日前'
  }
  return targetDate.format(DateFormat.DATE_TIME_SLASH)
}

/**
 * isNew
 * @param publishedTime
 * @param comparisonTime
 * @returns {boolean}
 */
export const isNew = (publishedTime: string, comparisonTime: string = moment().format()): boolean => {
  const comparisonDatetime = new Date(comparisonTime)
  const time = new Date(publishedTime)
  comparisonDatetime.setDate(comparisonDatetime.getDate() - 1)
  return comparisonDatetime.getTime() < time.getTime()
}

export const nowDatetime = () => {
  return moment().utc().toISOString(true)
}

export enum Period {
  DAY_BEFORE_YESTERDAY = 'DAY_BEFORE_YESTERDAY',
  YESTERDAY = 'YESTERDAY',
  LAST_WEEK = 'LAST_WEEK',
  LAST_MONTH = 'LAST_MONTH'
}

export interface ResultBetweenDate {
  from: string
  to: string
}

const convertStartDatetime = (date: string) => {
  return `${date} 00:00:00Z`
}

const convertEndDatetime = (date: string, useLessThan: boolean = false) => {
  if (useLessThan) {
    return `${formatDatetime(moment(`${date} 23:59:59Z`).add(1, 'second'), DateFormat.DATE)} 00:00:00Z`
  }
  return `${date} 23:59:59Z`
}

export const getBetweenDatetime = (
  targetDate: string,
  period: Period,
  useLessThan: boolean = false
): ResultBetweenDate => {
  const targetDatetime = moment(targetDate).utc()
  switch (period) {
    case Period.DAY_BEFORE_YESTERDAY: {
      return {
        from: convertStartDatetime(formatDatetime(moment(targetDatetime).add(-2, 'days'), DateFormat.DATE)),
        to: convertEndDatetime(formatDatetime(moment(targetDatetime).add(-2, 'days'), DateFormat.DATE), useLessThan)
      }
    }
    case Period.YESTERDAY: {
      return {
        from: convertStartDatetime(formatDatetime(moment(targetDatetime).add(-1, 'days'), DateFormat.DATE)),
        to: convertEndDatetime(formatDatetime(moment(targetDatetime).add(-1, 'days'), DateFormat.DATE), useLessThan)
      }
    }
    case Period.LAST_WEEK: {
      let firstWeekDate = ''
      for (let i = 1; i < 14; i++) {
        firstWeekDate = formatDatetime(moment(targetDatetime).add(-i, 'days'), DateFormat.DATE)
        if (formatDatetime(firstWeekDate, DateFormat.WEEKDAY) === 'Sunday') {
          break
        }
      }
      return {
        from: convertStartDatetime(formatDatetime(moment(firstWeekDate).add(-1, 'week'), DateFormat.DATE)),
        to: convertEndDatetime(formatDatetime(moment(firstWeekDate).add(-1, 'days'), DateFormat.DATE), useLessThan)
      }
    }
  }
  const targetMonthFirstDay = convertStartDatetime(`${formatDatetime(moment(targetDate), DateFormat.YEAR_MONTH)}-01`)
  return {
    from: convertStartDatetime(
      `${formatDatetime(moment(targetMonthFirstDay).add(-1, 'days'), DateFormat.YEAR_MONTH)}-01`
    ),
    to: convertEndDatetime(formatDatetime(moment(targetMonthFirstDay).add(-1, 'days'), DateFormat.DATE), useLessThan)
  }
}

export const isFirstOfMonth = (targetDate: string) => {
  return (
    moment(targetDate)
      .utc()
      .date() === 2 // AWSのcostの確定タイミングが一昨日分なので2日を月初とする
  )
}

export const getDate = () => {
  return formatDatetime(nowDatetime(), DateFormat.DATE_TIME)
}
