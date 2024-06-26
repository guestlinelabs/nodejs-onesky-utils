const queryString = require("node:querystring");

const _private = rootRequire("lib/privateFunctions.js");
const _globals = rootRequire("lib/globals.js");

const apiAddress = _globals.apiAddress;

/**
 * Post screenshot file form service
 *
 * OneSky Screenshot documentation
 * @link https://github.com/onesky/api-documentation-platform/blob/master/reference/screenshot.md
 *
 * @param  {Object}    options
 * @param  {Number}    options.projectId Project ID
 * @param  {String}    options.name A unique name to identify where the image located at your website, apps, blogs, etc... (Hints: path of the webpage)
 * @param  {String}    options.image Base64 encoded image data in Data URI scheme structure. Please reference to Data URI scheme and Base64
 * @param  {Object[]}  options.tags Translations bind to the screenshot
 * @param  {String}    options.tags[].key Key of the translation
 * @param  {Number}    options.tags[].x X-axis of the translation component
 * @param  {Number}    options.tags[].y Y-axis of the translation component
 * @param  {Number}    options.tags[].width Width of the translation component
 * @param  {Number}    options.tags[].height Height of the translation component
 * @param  {String}    options.tags[].file Name of the string file
 * @param  {String}    options.secret Private key to OneSky API
 * @param  {String}    options.apiKey Public key to OneSky API
 */
function postScreenshot(options) {
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
	const url = new URL(
		`${apiAddress}/1/projects/${options.projectId}/screenshots`,
	);
	url.search = new URLSearchParams({
		api_key: options.apiKey,
		timestamp: options.hash.timestamp,
		dev_hash: options.hash.devHash,
	}).toString();

	const formData = new FormData();
	formData.append(
		"screenshots",
		JSON.stringify([
			{
				name: options.name,
				image: options.image,
				tags: options.tags,
			},
		]),
	);
	formData.append("api_key", options.apiKey);
	formData.append("dev_hash", options.hash.devHash);
	formData.append("timestamp", options.hash.timestamp.toString());

	return {
		url,
		method: "POST",
		body: formData,
	};
}
module.exports = postScreenshot;
