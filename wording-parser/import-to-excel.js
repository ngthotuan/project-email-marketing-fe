const XLSX = require('xlsx')
const path = require('path')
const util = require('lodash')
const fs = require('fs')

// Init File path, sheetName
const fileOutputPath = path.join(__dirname, './Lang-Locale.xlsx')
const sheetName = 'lang'

function flattenObject(ob) {
  var toReturn = []
  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue
    if (typeof ob[i] === 'object') {
      var flatObject = flattenObject(ob[i])
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue
        toReturn.push(i + '.' + flatObject[x])
      }
    } else {
      toReturn.push(i)
    }
  }
  return toReturn
}

function readLocale(localePath) {
  const localeData = fs.readFileSync(localePath, {
    encoding: 'utf8'
  })
  let obj
  // eslint-disable-next-line no-eval
  eval('obj=' + localeData.replace('export default', ''))
  return obj
}

// Init locales location
const viInputPath = path.join(__dirname, '../src/lang/vi.js')
const enInputPath = path.join(__dirname, '../src/lang/en.js')

try {
  console.log(
    '\x1b[0m',
    '\x1b[37m',
    '\x1b[46m',
    'LOG: ',
    `Getting data from locale folder then exporting to file Excel`,
    '\x1b[0m\n'
  )
  // get VI
  const viData = readLocale(viInputPath)
  const enData = readLocale(enInputPath)

  const localeKey = util.uniq([
    ...flattenObject(viData),
    ...flattenObject(enData)
  ])

  const dataExport = [['Key', 'VI', 'EN']]

  localeKey.forEach(item => {
    dataExport.push([
      item,
      util.get(viData, item, ''),
      util.get(enData, item, '')
    ])
  })

  const wb = XLSX.utils.book_new()

  /* convert an array of arrays in JS to a CSF spreadsheet */
  const ws = XLSX.utils.aoa_to_sheet(dataExport)

  const objectMaxLength = []
  // Auto width
  dataExport.map(arr => {
    Object.keys(arr).map(key => {
      const value = arr[key] === null ? '' : arr[key]

      if (typeof value === 'number') {
        return (objectMaxLength[key] = 10)
      }

      objectMaxLength[key] =
        objectMaxLength[key] >= value.length
          ? objectMaxLength[key]
          : value.length
    })
  })

  const worksheetCols = objectMaxLength.map(width => ({
    width
  }))

  ws['!cols'] = worksheetCols

  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, fileOutputPath)
  console.log(
    '\x1b[0m',
    '\x1b[37m',
    '\x1b[42m',
    'SUCCESS: ',
    `EXPORT DONE`,
    '\x1b[0m \n'
  )
} catch (error) {
  console.log({ error })
  console.log(
    '\x1b[0m',
    '\x1b[37m',
    '\x1b[41m',
    'ERROR: ',
    ' Failed.........',
    '\x1b[0m \n'
  )
}
