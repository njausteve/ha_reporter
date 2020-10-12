import _ from 'lodash'

import { calculatePerclass } from './summary.js'
import { writeToExel } from './export.js'

import { paidClaimsWithNoDuplicates as paid } from './paid.js'
import { intimatedClaimsWithNoDuplicates as intimated } from './intimated.js'
import { endEstimatesClaimsWithNoDuplicates as osEndEstimates } from './endEstimate.js'
import { beginingClaimsWithNoDuplicates as osBeginingEstimates } from './beginningEstimate.js'

export function getAllClaims () {
  const allClaims = _([...osBeginingEstimates, ...intimated, ...paid, ...osEndEstimates])
    .groupBy('claimNumber')
    .map(claims => _.mergeWith({}, ...claims, (obj, src) =>
      _.isArray(obj) ? obj.concat(src) : undefined))
    .value()

  const allClaimsWithMeta = addClaimMeta(allClaims)
  const claimsOSBeginning = allClaims.filter(claim => oSBeginningClaims(claim))
  const claimsIntimated = allClaims.filter(claim => intimatedClaims(claim))
  const claimsPaid = allClaims.filter(claim => paidClaims(claim))
  const claimsOsEnd = allClaims.filter(claim => oSEndClaims(claim))
  const revivedClaims = allClaims.filter(claim => revivedClaim(claim).isRevived)
  const noClaims = allClaims.filter(claim => closedAsNoClaim(claim).isNoClaim)
  const movementClaims = allClaims.filter(claim => claimsWithMovement(claim).moved)
  const claimsPaidAndSettled = allClaims.filter(claim => paidAndSettledClaims(claim))

  const summaryData = [
    { name: 'claimsOSBeginningSummary', data: calculatePerclass(claimsOSBeginning, 'oSGrsReserveBeginning') },
    { name: 'claimsIntimatedSummary', data: calculatePerclass(claimsIntimated, 'initialReserves') },
    { name: 'claimsPaidSummary', data: calculatePerclass(claimsPaid, 'grsPaid') },
    { name: 'claimsOSEndSummary', data: calculatePerclass(claimsOsEnd, 'oSGrsReserveEnd') },
    { name: 'revivedClaimsSummary', data: calculatePerclass(revivedClaims, 'revivedAmount') },
    { name: 'noClaimsSummary', data: calculatePerclass(noClaims, 'noClaimAmount') },
    { name: 'movementClaimsSummary', data: calculatePerclass(movementClaims, 'movementAmount') },
    { name: 'claimsPaidAndSettledSummary', data: calculatePerclass(claimsPaidAndSettled, 'grsPaid') }
  ]

  const excelData = [
    { sheetName: 'SUMMARY', data: summaryData, type: 'summary' },
    { sheetName: 'ALL CLAIMS', data: allClaimsWithMeta },
    { sheetName: 'OS BEGINNING CLAIMS', data: claimsOSBeginning },
    { sheetName: 'INTIMATED CLAIMS', data: claimsIntimated },
    { sheetName: 'PAID CLAIMS', data: claimsPaid },
    { sheetName: 'OUTSTANDING END CLAIMS', data: claimsOsEnd },
    { sheetName: 'REVIVED CLAIMS', data: revivedClaims },
    { sheetName: 'CLOSED AS NO CLAIM CLAIMS', data: noClaims },
    { sheetName: 'CLAIMS MOVEMENT', data: movementClaims },
    { sheetName: 'PAID AND SETTLED CLAIMS', data: claimsPaidAndSettled }
  ]

  writeToExel(excelData)

  // eslint-disable-next-line
  // console.log('All claims', allClaims)

  // eslint-disable-next-line
  // console.log('All claims with metadata', addClaimMeta(allClaims))

  // eslint-disable-next-line
  // console.log('Revived claims', allClaims.filter(claim => revivedClaim(claim).isRevived))

  // eslint-disable-next-line
  // console.log('Paid claims', allClaims.filter(claim => paidClaims(claim)))

  // eslint-disable-next-line
  // console.log('Paid claims summary', calculatePerclass(allClaims.filter(claim => paidClaims(claim)), 'grsPaid'))

  // writeSummary(allClaims.filter(claim => paidClaims(claim)))

  // eslint-disable-next-line
  // console.log('Paid and settled claims', allClaims.filter(claim => paidAndSettledClaims(claim)))

  // eslint-disable-next-line
  // console.log('Paid and settled claims summary', calculatePerclass(allClaims.filter(claim => paidAndSettledClaims(claim)), 'grsPaid'))

  // eslint-disable-next-line
  // console.log('Closed as no claim claims', allClaims.filter(claim => closedAsNoClaim(claim).isNoClaim))

  // eslint-disable-next-line
  // console.log('Closed as no claim claims summary', calculatePerclass(allClaims.filter(claim => closedAsNoClaim(claim).isNoClaim), 'noClaimAmount'))

  // eslint-disable-next-line
  // console.log('Claims with movement', allClaims.filter(claim => claimsWithMovement(claim).moved))

  // eslint-disable-next-line
  // console.log('Claims with movement summary', calculatePerclass(allClaims.filter(claim => claimsWithMovement(claim).moved), 'movementAmount'))
}

/*
  Claims is not in beginging Oustanding estimate or Intimated but present
  in either paid or End outstanding estimate or both
*/
function revivedClaim (claim) {
  const revivedAmount = (claim.grsPaid || 0) + (claim.oSGrsReserveEnd || 0)
  const isRevived = (claim.grsPaid || claim.oSGrsReserveEnd) && !(claim.oSGrsReserveBeginning || claim.initialReserves)

  return { isRevived, revivedAmount }
}

/*
 These are all claims with a paid amount
*/
function paidClaims (claim) {
  return claim.grsPaid
}

function oSBeginningClaims (claim) {
  return claim.oSGrsReserveBeginning
}

function oSEndClaims (claim) {
  return claim.oSGrsReserveEnd
}

/*
 These are all claims with an InitialReserves amount
*/
function intimatedClaims (claim) {
  return claim.initialReserves
}

/*
 These are all claims with a paid amount and have zero or no outstanding
 End Estimate
*/
function paidAndSettledClaims (claim) {
  return claim.grsPaid && !claim.oSGrsReserveEnd
}

/*
  Claims Outstanding at beginning or claims Intimated but not paid or
  present in the outstanding estimate at the end of reporting period
*/
function closedAsNoClaim (claim) {
  const noClaimAmount = (claim.oSGrsReserveBeginning || 0) + (claim.initialReserves || 0)
  const isNoClaim = (claim.oSGrsReserveBeginning || claim.initialReserves) && !(claim.grsPaid || claim.oSGrsReserveEnd)

  return { isNoClaim, noClaimAmount }
}

/* os end estimate + paid amount - intimation + os begining estimate */
function claimsWithMovement (claim) {
  const claimMovement = getClaimMovement(claim)
  return claimMovement !== 0 ? { moved: true, amount: claimMovement } : { moved: false, amount: 0 }
}

function getClaimMovement (claim) {
  const oSGrsReserveEnd = claim.oSGrsReserveEnd || 0
  const oSGrsReserveBeginning = claim.oSGrsReserveBeginning || 0
  const grsPaid = claim.grsPaid || 0
  const initialReserves = claim.initialReserves || 0

  return (oSGrsReserveEnd + grsPaid) - (oSGrsReserveBeginning + initialReserves)
}

function addClaimMeta (claims) {
  return claims.map((claim) => {
    const movement = claimsWithMovement(claim)
    const revived = revivedClaim(claim)
    const noClaim = closedAsNoClaim(claim)

    movement.moved ? claim.movement = 'yes' : claim.movement = 'no'
    movement.moved ? claim.movementAmount = movement.amount : claim.movementAmount = 0

    revived.isRevived ? claim.revived = 'yes' : claim.revived = 'no'
    claim.revivedAmount = revived.revivedAmount

    noClaim.isNoClaim ? claim.closedAsNoClaim = 'yes' : claim.closedAsNoClaim = 'no'
    claim.noClaimAmount = noClaim.noClaimAmount

    paidAndSettledClaims(claim) ? claim.paidAndSettled = 'yes' : claim.paidAndSettled = 'no'

    return claim
  })
}
