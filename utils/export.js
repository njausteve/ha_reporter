import _ from 'lodash'

import XLSX from 'sheetjs-style'

export function writeToExel (data) {
  const wb = XLSX.utils.book_new()
  const outputFile = `Insurance Report ${timeStamp()}.xlsx`

  wb.SheetNames = []

  _.forEach(data, (value) => {
    const sheetName = value.sheetName

    wb.SheetNames.push(sheetName)

    if (value.type === 'summary') {
      writeSummaries(sheetName, wb, value.data)
    } else {
      writeClaimsData(value, wb, sheetName)
    }
  })

  XLSX.write(wb, {
    bookType: 'xlsx',
    type: 'binary',
    Props: { Author: 'E.Njau' }
  })

  XLSX.writeFile(wb, outputFile)
}

function capitalizeKeys (claims) {
  return _(claims)
    .map(claim => _.mapKeys(claim, (value, key) => _.upperCase(key)))
    .value()
}

function timeStamp () {
  const now = new Date()

  const date = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map(d => d.toString().length === 1 ? '0' + d : d)

  const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map(d => d.toString().length === 1 ? '0' + d : d)

  const timeSuffix = time[0] < 12 ? 'AM' : 'PM'

  return `${date.join('-')} at ${time.join('.')} ${timeSuffix}`
}

function writeClaimsData (value, wb, sheetName) {
  const dataWithCapitalizedKeys = capitalizeKeys(value.data)
  wb.Sheets[sheetName] = XLSX.utils.json_to_sheet(dataWithCapitalizedKeys)
}

/*
 B4, G4, L4, R4, B24, G24, L24, R24
*/

function writeSummaries (sheetName, wb, summaryData) {
  const originCells = ['B4', 'G4', 'L4', 'Q4', 'B25', 'G25', 'L25', 'Q25']
  const titleCells = ['B2', 'G2', 'L2', 'Q2', 'B23', 'G23', 'L23', 'Q23']

  wb.Sheets[sheetName] = XLSX.utils.json_to_sheet([])

  _.forEach(summaryData, (value, index) => {
    const dataWithCapitalizedKeys = capitalizeKeys(value.data)
    const origin = originCells[index]
    const titleCell = titleCells[index]

    // {
    //   wch: 10
    // },
    // {
    //   wch: 20
    // }

    wb.Sheets[sheetName][titleCell] = {
      t: 's',
      v: _.upperCase(value.name),
      s: {
        font: {
          sz: 14,
          bold: true
        }
      }
    }

    XLSX.utils.sheet_add_json(wb.Sheets[sheetName], dataWithCapitalizedKeys, { origin })
  })

  wb.Sheets[sheetName]['!cols'] = []

  _.forEach([1, 6, 11, 16], (value) => {
    wb.Sheets[sheetName]['!cols'][value] = {
      wch: 25
    }
  })

  _.forEach([2, 7, 12, 17], (value) => {
    wb.Sheets[sheetName]['!cols'][value] = {
      wch: 6
    }
  })

  _.forEach([3, 8, 13, 18], (value) => {
    wb.Sheets[sheetName]['!cols'][value] = {
      wch: 14
    }
  })
}
