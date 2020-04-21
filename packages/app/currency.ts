import axios from 'axios'

const RATE_API = 'https://www.gaitameonline.com'

const getInstance = () => {
  return axios.create({
    baseURL: RATE_API,
    timeout: 5000
  })
}

export enum CurrencyPair {
  USD_JPY = 'USDJPY'
}

export const getCurrencyRate = async (pair: CurrencyPair): Promise<number> => {
  try {
    const res = await getInstance().get('/rateaj/getrate')
    if (!res || !res.data) {
      console.error(`currency api call error`) // eslint-disable-line no-console
      return 100
    }

    const rate = res.data.quotes.find(item => item.currencyPairCode === pair)
    if (!rate) {
      console.warn(`missing currency pair. ${pair}`) // eslint-disable-line no-console
      return 100
    }

    return Number(rate.ask)
  } catch (e) {
    console.error(e) // eslint-disable-line no-console
    return 100
  }
}
