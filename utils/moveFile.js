var fs = require("fs/promises");
const customError = require("http-errors");

module.exports = async (oldPath, newPath) => {
  try {
    await fs.rename(oldPath, newPath);
  } catch (err) {
    throw customError(404, "no such file or directory");
  }
};
