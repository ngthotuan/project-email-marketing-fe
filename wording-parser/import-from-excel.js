var XLSX = require('xlsx')
const path = require('path')
const util = require('lodash')
const fs = require('fs')

// Init File path, sheetName
const filePath = path.join(__dirname, './Lang-Locale.xlsx')
const sheetName = 'lang'

// Init locales location
const viOutputPath = path.join(__dirname, './output/vi.js')
const enOutputPath = path.join(__dirname, './output/en.js')

const viJson = {}
const enJson = {}

// Init XLSX
const workbook = XLSX.readFile(filePath)
const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

if (xlData) {
  xlData.forEach(item => {
    if (!util.isEmpty(item.VI)) util.setWith(viJson, item.Key, item.VI, Object)
    if (!util.isEmpty(item.EN)) util.setWith(enJson, item.Key, item.EN, Object)
  })
}

const writeFile = function(data, outputPath, name) {
  try {
    console.log(
      '\x1b[0m',
      '\x1b[37m',
      '\x1b[46m',
      'LOG: ',
      `===${name}===`,
      '\x1b[0m \n'
    )

    fs.writeFileSync(
      outputPath,
      `export default ${JSON.stringify(data, null, 4)}`,
      {
        encoding: 'utf8'
      }
    )

    console.log(
      '\x1b[0m',
      '\x1b[37m',
      '\x1b[42m',
      'SUCCESS: ',
      `IMPORT ${name} DONE`,
      '\x1b[0m \n'
    )
  } catch (err) {
    console.error(err)

    console.log(
      '\x1b[0m',
      '\x1b[37m',
      '\x1b[41m',
      'ERROR: ',
      '\x1b[0m' + ' Failed......... \n'
    )
  }
}

console.log(
  '\x1b[0m',
  '\x1b[37m',
  '\x1b[46m',
  'LOG: ',
  'Starting IMPORT from EXCEL',
  '\x1b[0m \n'
)
writeFile(viJson, viOutputPath, 'VI')
writeFile(enJson, enOutputPath, 'EN')

console.log(
  '\x1b[0m',
  '\x1b[37m',
  '\x1b[42m',
  `IMPORT DONE => Please copy files inside output to locales folder`,
  '\x1b[0m \n'
)
