import * as https from 'https'
import * as moment from 'moment'

import { ResultCost } from './cost'
import { DateFormat, ResultBetweenDate } from '../utils/datetimeUtils'
import { splitArray } from '../utils/arrayUtils'

export const postCostMessage = async (targetDate: ResultBetweenDate, fields: ResultCost[], isFirstOfMonth: boolean) => {
  const blocks = []

  let title = moment(targetDate.from)
    .utc()
    .format(DateFormat.DATE)
  if (isFirstOfMonth) {
    title = moment(targetDate.from)
      .utc()
      .format(DateFormat.YEAR_MONTH)
  }
  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*${title}のコストです* :money_with_wings:`
    }
  })

  blocks.push({
    type: 'divider'
  })

  const messageFields = []

  for (const field of fields) {
    messageFields.push({
      type: String('mrkdwn'),
      text: String(`*${field.key}*\n${String(field.val)}円`)
    })
  }

  const splitArr = splitArray(messageFields,  10)

  for (const arr of splitArr) {
    blocks.push({
      type: 'section',
      fields: arr
    })
  }

  blocks.push({
    type: 'divider'
  })

  const message = {
    blocks
  }

  return new Promise(resolve => {
    const body = JSON.stringify(message)
    const options: https.RequestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }
    const postReq = https.request(process.env.COST_WEB_HOOK_URL, options, res => {
      const chunks = []
      res.setEncoding('utf8')
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.error('slack send error', message) // eslint-disable-line no-console
        } else {
          console.info('send slack OK') // eslint-disable-line no-console
        }
        resolve()
      })
    })
    postReq.write(body)
    postReq.end()
  })
}
