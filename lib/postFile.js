"use strict";

const _private = rootRequire("lib/privateFunctions.js");
const _globals = rootRequire("lib/globals.js");

const apiAddress = _globals.apiAddress;

/**
 * Post translations file form service
 * @param  {Object}  options
 * @param  {Number}  options.projectId Project ID
 * @param  {String}  options.format File format (see documentation)
 * @param  {String}  options.content File to upload
 * @param  {Boolean} options.keepStrings Keep previous, non present in this file strings
 * @param  {String}  options.secret Private key to OneSky API
 * @param  {String}  options.apiKey Public key to OneSky API
 * @param  {String}  options.language Language of the uploaded file
 * @param  {String}  options.fileName Name of the uploaded file
 */
function postFile(options) {
	options.hash = _private.getDevHash(options.secret);
	return _private.makeRequest(
		_getUploadOptions(options),
		"Unable to upload document",
	);
}

/**
 * @param  {Object} options
 * @return {Object}
 * @private
 */
function _getUploadOptions(options) {
	const url = new URL(`${apiAddress}/1/projects/${options.projectId}/files`);
	url.search = new URLSearchParams({
		api_key: options.apiKey,
		timestamp: options.hash.timestamp,
		dev_hash: options.hash.devHash,
	}).toString();

	const formData = new FormData();
	formData.append("file", new Blob([options.content]), options.fileName);
	formData.append("api_key", options.apiKey);
	formData.append("dev_hash", options.hash.devHash);
	formData.append("file_format", options.format);
	formData.append("is_keeping_all_strings", options.keepStrings.toString());
	formData.append("locale", options.language);
	formData.append("timestamp", options.hash.timestamp.toString());
	formData.append(
		"is_allow_translation_same_as_original",
		(options.allowSameAsOriginal || false).toString(),
	);

	return {
		url,
		method: "POST",
		body: formData,
	};
}
module.exports = postFile;
