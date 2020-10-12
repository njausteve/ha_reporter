import _ from 'lodash'
const claimNumbers = ['claimNo', 'claimNumber']

const commonFields = ['class', 'claimNumber', 'subClass']

export const requiredKeys = {
  intimated: commonFields.concat(['initialReserves']),
  beginningEstimate: commonFields.concat(['oSGrsReserveBeginning']),
  EndEstimate: commonFields.concat(['oSGrsReserveEnd']),
  paid: commonFields.concat(['grsPaid'])
}

export function addSheetName (claim, sheetName) {
  return { ...claim, claimType: sheetName }
}

export function renameKeys (claimType, key) {
  const keyToRename = _.camelCase(key)

  if (claimType === 'beginningEstimate' && keyToRename === 'oSGrsReserve') {
    return `${keyToRename}Beginning`
  } else if (claimType === 'EndEstimate' && keyToRename === 'oSGrsReserve') {
    return `${keyToRename}End`
  } else {
    return claimNumbers.includes(keyToRename) ? 'claimNumber' : keyToRename
  }
}

export function getRequiredClaimData (claims, requiredKeys) {
  return _.map(claims, (claim) => {
    const requiredKeysList = requiredKeys[claim.claimType]
    return Object.assign({}, ...requiredKeysList.map(key => ({ [key]: claim[key] })))
  })
}

export function sumRepeatedClaims (claimsList, keyToSumUp) {
  return _.chain(claimsList)
    .groupBy('claimNumber')
    .map(g => (_.mergeWith({}, ...g, (objValue, srcValue, key) => {
      return g.length > 1 && objValue && key === keyToSumUp ? sumValues(objValue, srcValue) : undefined
    })))
    .value()
}

const sumValues = (value1, value2) => _.round(value1 + value2, 2)

export function toCurrency (value) {
  return value.toLocaleString('en-US')
}
