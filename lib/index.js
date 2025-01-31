/*!
 * escss-estest v1.4.26
 * (c) 2024 Mike Lee
 * @license AGPL-3.0-only OR Commercial
 */

const _isDisabledESTest = false
const defaultPubMsg = 'Custom your version (visible in dev and prod).'

let _testToken = ''
const TOKEN_TYPES = ['undefined', 'null', 'array', 'date', 'object', 'boolean', 'NaN', 'number', 'bigint', 'string', 'symbol', 'function']

/**
 * @param {*} input
 * @returns {string}
 */
function getTokenType(input) {
  const isNull = input === null
  const isNaN = Number.isNaN(input)

  // for all situation. e.g, browser, node, iframe, web worker
  const isArray = Object.prototype.toString.call(input) === "[object Array]"
  const isDate = Object.prototype.toString.call(input) === "[object Date]"

  const map = {
    string: 'string',
    undefined: 'undefined',
    object: isNull ? 'null' : isArray ? 'array' : isDate ? 'date' : 'object',
    boolean: 'boolean',
    number: isNaN ? 'NaN' : 'number',
    bigint: 'bigint',
    symbol: 'symbol',
    function: 'function',
  }

  return (
    map[typeof input]
    || `❌ Unexpected error, please send issue to https://github.com/ESCSS-labs/ESCSS-ESTest/issues. input: ${input}.`
  )
}

/**
 * A JavaScript runtime testing library inspired by TDD, Joi, and Zod.
 * @param {*} input
 * @param { 'undefined' | 'null' | 'array' | 'date' | 'object' | 'boolean' | 'NaN' | 'number' | 'bigint' | 'string' | 'symbol' | 'function' } tokenType
 * @param {string} pubMsg
 */
function ESTest(input, tokenType, pubMsg = defaultPubMsg) {
  if (!_isDisabledESTest) {
    try {
      if (process.env.NODE_ENV === 'production') throw new Error(`\n 📝 Public Message: ${pubMsg} \n 🚫 Details hidden for security. Check in dev mode.`)
      else {
        if (!TOKEN_TYPES.includes(tokenType)) {
          setTimeout(() => console.log('❌ Received 2nd Argument tokenType: ', tokenType), 0)
          throw new Error(`\n 📝 Public Message: ${pubMsg} \n ✅ Expected 2nd Argument tokenType: 'undefined' | 'null' | 'array' | 'date' | 'object' | 'boolean' | 'NaN' | 'number' | 'bigint' | 'string' | 'symbol' | 'function'`)
        }
        else if (!['undefined', 'string'].includes(typeof pubMsg)) {
          throw new Error(`\n 📝 Public Message: ${pubMsg} \n ✅ Expected Public Message: 'string'`)
        }
        else if (getTokenType(input) === 'date' && input.toString() === 'Invalid Date') {
          setTimeout(() => console.log(`❌ Received: '${getTokenType(input)}'`, input), 0)
          throw new Error(`\n 📝 Public Message: ${pubMsg} \n ✅ Expected: 'date'`)
        }
        else if (getTokenType(input) !== tokenType) {
          setTimeout(() => console.log(`❌ Received: '${getTokenType(input)}'`, input), 0)
          throw new Error(`\n 📝 Public Message: ${pubMsg} \n ✅ Expected: '${tokenType}'`)
        }
      }
      if (process.env.NODE_ENV === 'test') {
        _testToken = tokenType
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export { _testToken, _isDisabledESTest, ESTest }
