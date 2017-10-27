const path = require("path");

const DIST_DIR   = path.join(__dirname, "public/dist"),
  CLIENT_DIR = path.join(__dirname, "public/javascripts/");

module.exports = {
  context: CLIENT_DIR,

  entry: "./index",

  output: {
    path:     DIST_DIR,
    filename: "bundle.js"
  },

  resolve: {
    extensions: ['*', '.js']
  }
};