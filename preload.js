const { contextBridge } = require("electron");
const path = require("path");

const pouchdbPath = path.join(__dirname, "pouchdb.js");
const { saveUser, getUser, verifyPassword } = require(pouchdbPath);

require("dotenv").config();

contextBridge.exposeInMainWorld("env", {
  API_URL: process.env.API_URL,
});

contextBridge.exposeInMainWorld("pouchdb", {
  saveUser,
  getUser,
  verifyPassword,
});
