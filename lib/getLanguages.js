const queryString = require("node:querystring");

const _private = rootRequire("lib/privateFunctions.js");
const _globals = rootRequire("lib/globals.js");

const apiAddress = _globals.apiAddress;

/**
 * Get list of project languages
 * @param  {Object} options
 * @param  {Number} options.projectId Project ID
 * @param  {String} options.secret Private key to OneSky API
 * @param  {String} options.apiKey Public key to OneSky API
 */
function getLanguages(options) {
	options.hash = _private.getDevHash(options.secret);
	return _private.makeRequest(
		_getLink(options),
		"Unable to fetch project languages",
	);
}

/**
 * @param  {Object} options
 * @return {String}
 * @private
 */
function _getLink(options) {
	return `${apiAddress}/1/projects/${
		options.projectId
	}/languages?${queryString.stringify({
		api_key: options.apiKey,
		timestamp: options.hash.timestamp,
		dev_hash: options.hash.devHash,
	})}`;
}

module.exports = getLanguages;
