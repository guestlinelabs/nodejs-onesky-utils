module.exports = {
  getDevHash: _getDevHash,
  handleError: _handleError,
  makeRequest: _makeRequest,
};

const md5 = require("md5");

/**
 * @param  {String} secret
 * @return {Object}
 * @private
 */
function _getDevHash(secret) {
  const timestamp = Math.floor(Date.now() / 1000);

  return {
    devHash: md5(timestamp + secret),
    timestamp: timestamp,
  };
}

/**
 * @param  {string|Object}   urlOrOptions URL to get from or object with request config
 * @param  {string}          message Error message
 * @private
 */
async function _makeRequest(urlOrOptions, message) {
  const url =
    typeof urlOrOptions === "string" ? urlOrOptions : urlOrOptions.url;
  const { url: _, ...options } =
    typeof urlOrOptions === "string" ? {} : urlOrOptions;

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    return data;
  } catch (err) {
    return _handleError(message, err);
  }
}

/**
 * @param  {Object} data
 * @private
 */
async function _handleError(message, data) {
  const error = {};

  try {
    const content = await data.json();
    if (content.meta) {
      error.message = content.meta.message;
      error.code = content.meta.status;
    } else {
      error.message = content.message;
      error.code = content.code;
    }
  } catch (e) {
    error.message = message;
    error.code = 500;
  }

  throw error;
}
