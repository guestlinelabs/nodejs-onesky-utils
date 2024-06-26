const queryString = require("node:querystring");

const _private = rootRequire("lib/privateFunctions.js");
const _globals = rootRequire("lib/globals.js");

const apiAddress = _globals.apiAddress;

/**
 * Get translations file form service
 * @param  {Object} options
 * @param  {Number} options.projectId Project ID
 * @param  {String} options.secret Private key to OneSky API
 * @param  {String} options.apiKey Public key to OneSky API
 * @param  {String} options.language Language to download
 * @param  {String} options.fileName File name to download
 */
function getFile(options) {
	options.hash = _private.getDevHash(options.secret);
	return _private.makeRequest(_getLink(options), "Unable to fetch document");
}

/**
 * @param  {Object} options
 * @return {String}
 * @private
 */
function _getLink(options) {
	return `${apiAddress}/1/projects/${
		options.projectId
	}/translations?${queryString.stringify({
		locale: options.language,
		api_key: options.apiKey,
		timestamp: options.hash.timestamp,
		dev_hash: options.hash.devHash,
		source_file_name: options.fileName,
	})}`;
}

module.exports = getFile;
