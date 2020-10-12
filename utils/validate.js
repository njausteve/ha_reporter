// import XLSX from 'xlsx'
import _ from 'lodash'
import { requiredKeys, addSheetName, renameKeys } from './utils.js'

const beginningEstimate = require('./beginningEstimate.json').map(claim => addSheetName(claim, 'beginningEstimate'))
const intimated = require('./intimated.json').map(claim => addSheetName(claim, 'intimated'))
const paid = require('./paid.json').map(claim => addSheetName(claim, 'paid'))
const EndEstimate = require('./endEstimate.json').map(claim => addSheetName(claim, 'EndEstimate'))

export async function checkFile (file) {
  // const fileData = await readFile(file)

  // eslint-disable-next-line
  console.log('file: ', file)

  const columnCheckbeginningEstimate = await checkColumnNames(beginningEstimate, 'beginningEstimate')
  const columnCheckintimated = await checkColumnNames(intimated, 'intimated')
  const columnCheckpaid = await checkColumnNames(paid, 'paid')
  const columnCheckEndEstimate = await checkColumnNames(EndEstimate, 'EndEstimate')

  combineAllSheets(beginningEstimate, intimated, paid, EndEstimate)

  // eslint-disable-next-line
  console.log('results', columnCheckbeginningEstimate, columnCheckintimated, columnCheckpaid, columnCheckEndEstimate)

  return false
}

export function combineAllSheets (beginningEstimate, intimated, paid, EndEstimate) {
  // const allClaims = _.concat(beginningEstimate, intimated, paid, EndEstimate).map(claim => _.mapKeys(claim, (value, key) => renameKeys(claim.claimType, key)))

  // const allClaimsGroupedByClaimNumber = _.groupBy(allClaims, claim => claim.claimNumber)

  /* This will go to the excel sheet with all the results
  */
  // const allClaimsSortedbyClaimNumber = _.uniq(_.flatten(_.filter(allClaimsGroupedByClaimNumber, n => n)))

  // const repeatedClaims = _.uniq(_.flatten(_.filter(allClaimsGroupedByClaimNumber, n => n.length > 1)))

}

// function getBegginingOSGrsReserve(claims){

// }

// function readFile (file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader()

//     reader.readAsArrayBuffer(file)
//     reader.onload = () => {
//       const workbook = XLSX.read(reader.result, { type: 'array' })
//       const targetSheetName = workbook.SheetNames[0]
//       const targetSheet = XLSX.utils.sheet_to_json(workbook.Sheets[targetSheetName])

//       // eslint-disable-next-line
//     console.log('workbook', workbook)

//       // eslint-disable-next-line
//     console.log('targetSheet', targetSheet)

//       resolve({
//         fileName: file.name,
//         sheetName: targetSheetName,
//         data: targetSheet
//       })
//     }

//     reader.onerror = err => reject(err)
//   })
// }

/*
 1. Read file
 2. Check all titles
 3.

 # claimNo
 - CLAIM NUMBER
 - CLAIM NO.

 # class
 - CLASS

 #intimationAmount
 - initialReserves

 # paidAmount
 - GRS.PAID

 # begining estimate
 - O/S GRS. RESERVE

 # End estimate
 - O/S GRS. RESERVE

 */

function checkColumnNames (data, sheetName = 'intimated') {
  const errors = []

  const keysInfirstItem = _.keys(data[0]).map(key => renameKeys(key))

  const missingKeys = _.difference(requiredKeys[sheetName], keysInfirstItem)

  if (missingKeys.length > 0) {
    missingKeys.forEach((key) => {
      errors.push({
        sheetName,
        key,
        message: `${_.startCase(key)} column is missing or its title is incorrect`,
        advice: `Check that a column with the name ${_.startCase(key)} is present. Confirm that the column name is ${_.startCase(key)}`
      })
    })
  }

  // eslint-disable-next-line
  console.log('keysInfirstItem', keysInfirstItem)
  // eslint-disable-next-line
  console.log('keysInfirstItem', missingKeys)

  // eslint-disable-next-line
  console.log('errors', errors)

  return errors
}

// function renameObjKey (obj, key, newKey) {
//   if (_.includes(_.keys(obj), key)) {
//     obj[newKey] = _.clone(obj[key], true)

//     delete obj[key]
//   }

//   return obj
// };
