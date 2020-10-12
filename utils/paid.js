import _ from 'lodash'
import { requiredKeys, addSheetName, renameKeys, sumRepeatedClaims, getRequiredClaimData } from './utils.js'

const data = require('./paid.json')

const paid = data.map(claim => addSheetName(claim, 'paid'))
  .map(claim => _.mapKeys(claim, (value, key) => renameKeys(claim.claimType, key)))

export const paidWithRequiredKeys = getRequiredClaimData(paid, requiredKeys)
export const paidClaimsWithNoDuplicates = sumRepeatedClaims(paidWithRequiredKeys, 'grsPaid')
// eslint-disable-next-line
  // console.log('Paid estimates', paid)

// eslint-disable-next-line
  // console.log('paid claims with no repeated initialReserves values', paidClaimsWithNoDuplicates)
