import _ from 'lodash'
import { toCurrency } from './utils'

/*
 Class BONDS -> Class MISCELLANEOUS class ✅
 P.A. RIDER (LIFE BUSINESS) -> PERSONAL ACCIDENT class ✅
 SUB CLASS: "COMMERCIAL PSV", -> PSV class ✅
 */

export function calculatePerclass (claims, valueUsedToCalculate) {
  const classes = getClasses()

  claims.map((claim) => {
    const insClass = claim.class
    const subClass = claim.subClass
    const value = claim[valueUsedToCalculate]

    if (insClass === 'MOTOR PRIVATE') {
      countValue(value, classes, 'motorPrivate')
      // motor private
    } else if (insClass === 'MISCELLANEOUS' || insClass === 'BONDS') {
      // MISCELLANEOUS
      countValue(value, classes, 'miscellaneous')
    } else if (insClass === 'FIRE DOMESTIC') {
      // FIRE DOMESTIC
      countValue(value, classes, 'fireDomestic')
    } else if (insClass === 'MARINE AND TRANSIT GOODS') {
      // MARINE
      countValue(value, classes, 'marine')
    } else if (insClass === 'FIRE INDUSTRIAL') {
      countValue(value, classes, 'fireIndustrial')
      // FIRE INDUSTRIAL
    } else if (insClass === 'LIABILITY') {
      countValue(value, classes, 'liability')
      // LIABILITIES
    } else if (insClass === 'MOTOR COMMERCIAL' && subClass !== 'COMMERCIAL PSV') {
      // MOTOR COMMERCIAL
      countValue(value, classes, 'motorCommercial')
    } else if (insClass === 'ENGINEERING') {
      // ENGINEERING
      countValue(value, classes, 'engineering')
    } else if (insClass === 'THEFT') {
      // THEFT
      countValue(value, classes, 'theft')
    } else if (insClass === 'PERSONAL ACCIDENT' || insClass === 'P.A. RIDER (LIFE BUSINESS)') {
      // PERSONAL ACCIDENT
      countValue(value, classes, 'personalAccident')
    } else if (
      insClass === 'WORKMENS COMPENSATION' ||
      insClass === "WORKMEN'S COMPENSATION" ||
      insClass === 'WORKMEN COMPENSATION'
    ) {
      // WORKMENS COMPENSATION
      countValue(value, classes, 'workmensCompensation')
    } else if (insClass === 'MEDICAL') {
      // MEDICAL
      countValue(value, classes, 'medical')
    } else if (insClass === 'PSV' || subClass === 'COMMERCIAL PSV') {
      // PSV
      countValue(value, classes, 'psv')
    } else {
      // noCategory
      countValue(value, classes, 'noCategory')
    }
  })

  return getSummaryTotals(classes)
}

function getSummaryTotals (classes) {
  return _(classes)
    .map((value, key) => ({
      class: _.upperCase(key),
      count: value.count,
      total: toCurrency(value.total)
    }))
    .value()
}

function getClasses () {
  const classNamesList = [
    'motorPrivate',
    'miscellaneous',
    'fireDomestic',
    'marine',
    'fireIndustrial',
    'liability',
    'motorCommercial',
    'engineering',
    'theft',
    'personalAccident',
    'workmensCompensation',
    'medical',
    'noCategory',
    'psv',
    'subTotal'
  ]

  const classesObj = {}

  for (const className of classNamesList) {
    classesObj[className] = { count: 0, total: 0 }
  }

  return classesObj
}

function countValue (value, classes, className) {
  const currentTotal = classes[className].total
  const currentSubTotal = classes.subTotal.total

  classes[className].total = currentTotal + value
  classes[className].count = ++classes[className].count

  classes.subTotal.total = currentSubTotal + value
  classes.subTotal.count = ++classes.subTotal.count
}
