const queryString = require("node:querystring");

const _private = rootRequire("lib/privateFunctions.js");
const _globals = rootRequire("lib/globals.js");

const apiAddress = _globals.apiAddress;

/**
 * Get all translations files from service
 * @param  {Object} options
 * @param  {Number} options.projectId Project ID
 * @param  {String} options.secret Private key to OneSky API
 * @param  {String} options.apiKey Public key to OneSky API
 */
function getFiles(options) {
	options.hash = _private.getDevHash(options.secret);
	return _private.makeRequest(
		_getLink(options),
		"Unable to fetch project files",
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
	}/files?${queryString.stringify({
		api_key: options.apiKey,
		timestamp: options.hash.timestamp,
		dev_hash: options.hash.devHash,
	})}`;
}

module.exports = getFiles;
