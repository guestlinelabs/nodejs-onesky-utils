global.rootRequire = (name) => require(`${__dirname}/${name}`);

module.exports = {
  getFile: rootRequire("lib/getFile.js"),
  getFiles: rootRequire("lib/getFiles.js"),
  getMultilingualFile: rootRequire("lib/getMultilingualFile.js"),
  postFile: rootRequire("lib/postFile.js"),
  postScreenshot: rootRequire("lib/postScreenshot.js"),
  getLanguages: rootRequire("lib/getLanguages.js"),
};
