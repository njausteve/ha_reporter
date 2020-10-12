import _ from 'lodash'
import { addSheetName, renameKeys, requiredKeys, getRequiredClaimData, sumRepeatedClaims } from './utils.js'

const data = require('./endEstimate.json')

const endEstimate = data.map(claim => addSheetName(claim, 'EndEstimate'))
  .map(claim => _.mapKeys(claim, (value, key) => renameKeys(claim.claimType, key)))

export const endEstimatesWithRequiredKeys = getRequiredClaimData(endEstimate, requiredKeys)
export const endEstimatesClaimsWithNoDuplicates = sumRepeatedClaims(endEstimatesWithRequiredKeys, 'oSGrsReserveEnd')

// eslint-disable-next-line
// console.log('end estimates', endEstimatesWithRequiredKeys)

// eslint-disable-next-line
// console.log('End estimates with no repeated oSGrsReserveEnd values', endEstimatesClaimsWithNoDuplicates )
