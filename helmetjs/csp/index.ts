type F = (b:{}, o: any) => any;

var camelize:any// = require('camelize')
var cspBuilder:any// = require('content-security-policy-builder')
var platform:any// = require('platform')
var containsFunction:any// = require('./lib/contains-function')
var getHeaderKeysForBrowser:any// = require('./lib/get-header-keys-for-browser')
var transformDirectivesForBrowser:F// = require('./lib/transform-directives-for-browser')
var parseDynamicDirectives:any// = require('./lib/parse-dynamic-directives')
var ALL_HEADERS:any// = require('./lib/all-headers')
var module:any//

module.exports = function csp (options) {
  options = options || {}

  var originalDirectives = camelize(options.directives || {})
  var directivesAreDynamic = containsFunction(originalDirectives)

  if (options.reportOnly && !originalDirectives.reportUri) {
    throw new Error('Please remove reportOnly or add a report-uri.')
  }

  return function csp (req, res, next) {
  var userAgent: {} | null | undefined = req.headers['user-agent']

  var browser: null | undefined | {}
    if (userAgent) {
      browser = platform.parse(userAgent)
    }

    var headerKeys
    if (options.setAllHeaders || !userAgent) {
      headerKeys = ALL_HEADERS
    } else {
      headerKeys = getHeaderKeysForBrowser(browser, options)
    }

    if (headerKeys.length === 0) {
      next()
      return
    }

    var directives = transformDirectivesForBrowser(browser, originalDirectives)

    if (directivesAreDynamic) {
      directives = parseDynamicDirectives(directives, [req])
    }

    var policyString = cspBuilder({ directives: directives })

    headerKeys.forEach(function (headerKey) {
      if (options.reportOnly) {
        headerKey += '-Report-Only'
      }
      res.setHeader(headerKey, policyString)
    })

    next()
  }
}
