import i18n, { t } from './i18n'

export const getDateFormatString = ({ locale = i18n.language, upper = false } = {}) => {
  const formatObj = new Intl.DateTimeFormat(locale).formatToParts(new Date())

  return formatObj
    .map((obj) => {
      switch (obj.type) {
        case 'day':
          return upper ? 'DD' : 'dd'
        case 'month':
          return upper ? 'MM' : 'mm'
        case 'year':
          return upper ? 'YYYY' : 'yyyy'
        default:
          return obj.value
      }
    })
    .join('')
}

export const joinTranslatedList = (list: string[], condition: 'or' | 'and' = 'or') => {
  return list.reduce(function (acc, el, i) {
    return acc + (i === list.length - 1 ? ` ${t(`common.${condition}`, condition)} ` : ', ') + el
  })
}
