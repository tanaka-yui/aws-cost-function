import * as AWS from 'aws-sdk'
import * as crypto from 'crypto'
import { head, round } from 'lodash'

import { CurrencyPair, getCurrencyRate } from './currency'

const costExplorer = new AWS.CostExplorer({ region: 'us-east-1' })

export interface ResultCost {
  key: string
  val: number
}

const md5 = (data: string): string => {
  return crypto
    .createHash('md5')
    .update(data)
    .digest('hex')
}

export const getCost = async (start: string, end: string): Promise<ResultCost[]> => {
  const TimePeriod = {
    Start: start,
    End: end
  }

  const params = {
    Granularity: 'DAILY',
    Metrics: ['UNBLENDED_COST', 'AMORTIZED_COST'],
    GroupBy: [
      {
        Type: 'DIMENSION',
        Key: 'SERVICE'
      }
    ],
    TimePeriod
  }

  const rate = await getCurrencyRate(CurrencyPair.USD_JPY)

  return new Promise((resolve, reject) => {
    costExplorer.getCostAndUsage(params, (err, data) => {
      if (err) {
        console.error(err, err.stack) // eslint-disable-line no-console
        return reject()
      }
      const costs: { [key: string]: ResultCost } = {}
      let total = 0
      for (const item of data.ResultsByTime) {
        for (const group of item.Groups) {
          if (group.Keys && group.Metrics && group.Metrics.UnblendedCost) {
            const amount = Number(group.Metrics.UnblendedCost.Amount)
            const val = amount > 0 ? amount : 0
            if (!val) continue

            const key = head(group.Keys)
            const hash = md5(key)
            if (costs[hash]) {
              costs[hash] = {
                key,
                val: costs[hash].val + val
              }
            } else {
              costs[hash] = {
                key,
                val
              }
            }
            total += val
          }
        }
      }

      const result: ResultCost[] = []
      for (const key of Object.keys(costs)) {
        const obj = costs[key]
        result.push({
          key: obj.key,
          val: round(obj.val * rate, 2)
        })
      }

      result.push({
        key: 'Total',
        val: round(total * rate, 2)
      })

      return resolve(result)
    })
  })
}
