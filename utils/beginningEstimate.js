import _ from 'lodash'
import { requiredKeys, addSheetName, renameKeys, sumRepeatedClaims, getRequiredClaimData } from './utils.js'

const data = require('./beginningEstimate.json')

const beginingEstimate = data.map(claim => addSheetName(claim, 'beginningEstimate'))
  .map(claim => _.mapKeys(claim, (value, key) => renameKeys(claim.claimType, key)))

export const beginingEstimatesWithRequiredKeys = getRequiredClaimData(beginingEstimate, requiredKeys)
export const beginingClaimsWithNoDuplicates = sumRepeatedClaims(beginingEstimatesWithRequiredKeys, 'oSGrsReserveBeginning')
// eslint-disable-next-line
// console.log('begining estimates', beginingEstimate)

// eslint-disable-next-line
// console.log('begining estimates with no repeated oSGrsReserveBeginning values', beginingClaimsWithNoDuplicates)
