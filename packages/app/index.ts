import * as moment from 'moment'

import { getBetweenDatetime, isFirstOfMonth, Period, DateFormat } from '../utils/datetimeUtils'
import { postCostMessage } from './slack'
import { getCost } from './cost'

export default async function() {
  const targetDate = moment()
    .utc()
    .format(DateFormat.DATE_TIME)

  let period = Period.DAY_BEFORE_YESTERDAY
  const isFirst = isFirstOfMonth(targetDate)
  if (isFirst) {
    period = Period.LAST_MONTH
  }
  const result = getBetweenDatetime(targetDate, period, true)

  console.log(`execute datetime is ${targetDate}. mode: ${period}. from: ${result.from}, to: ${result.to}`) // eslint-disable-line no-console

  const fields = await getCost(
    moment(result.from)
      .utc()
      .format(DateFormat.DATE),
    moment(result.to)
      .utc()
      .format(DateFormat.DATE)
  )

  await postCostMessage(getBetweenDatetime(targetDate, period, false), fields, isFirst)
}
