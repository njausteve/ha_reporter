import _ from 'lodash'
import { requiredKeys, addSheetName, renameKeys, sumRepeatedClaims, getRequiredClaimData } from './utils.js'

const data = require('./intimated.json')

const intimated = data.map(claim => addSheetName(claim, 'intimated'))
  .map(claim => _.mapKeys(claim, (value, key) => renameKeys(claim.claimType, key)))

export const intimatedWithRequiredKeys = getRequiredClaimData(intimated, requiredKeys)
export const intimatedClaimsWithNoDuplicates = sumRepeatedClaims(intimatedWithRequiredKeys, 'initialReserves')
// eslint-disable-next-line
// console.log('intimated estimates', intimated)

// eslint-disable-next-line
// console.log('intimated estimates with no repeated initialReserves values', intimatedClaimsWithNoDuplicates)
