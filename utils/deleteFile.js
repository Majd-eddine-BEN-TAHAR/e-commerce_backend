const fs = require("fs");
const rootDir = require("./rootDir");
const path = require("path");
const customError = require("http-errors");

const deleteFile = (filePath) => {
  try {
    fs.unlinkSync(path.join(rootDir, filePath));
  } catch (error) {
    throw customError(404, "image not found");
  }
};

module.exports = deleteFile;
