'use strict';
import fs from 'fs';
import path from 'path';
import stripBom from 'strip-bom';
import log from './logger/log.js';
var defaultconfig = {
  botname: "",
  uidbkt: "",
  uidad: [""],
  prefix: "",
  language: ""
};

module.exports = function getConfig() {
  return fs.existsSync(path.join(__dirname, "config.json")) ? (function () {
    try {
      var readedConfig = JSON.parse(stripBom(fs.readFileSync(path.join(__dirname, "config.json"), {
        encoding: "utf8"
      })));
    } catch (_) {
      log("[INTERNAL]", "Invalid config file. (Broken JSON?)");
      log("[INTERNAL]", "Attempting to write default config...");
      try {
        fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify(defaultconfig, null, 4), {
          mode: 0o666
        });
      } catch (ex) {
        log("[INTERNAL]", "Cannot write default config, returned an error: ", ex);
      }
      return defaultconfig;
    }
    for (let configName in defaultconfig) {
      if (!Object.prototype.hasOwnProperty.call(readedConfig, configName)) {
        readedConfig[configName] = defaultconfig[configName];
        log("[INTERNAL]", "Missing", configName, "in config file. Adding with default value (", defaultconfig[
          configName], ")...");
      }
    }
    for (let configName in readedConfig) {
      if (!Object.prototype.hasOwnProperty.call(defaultconfig, configName)) {
        delete readedConfig[configName];
        log("[INTERNAL]", "Deleted ", configName, "in config file. (unused)");
      }
    }
    fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify(readedConfig, null, 4), {
      mode: 0o666
    });
    return readedConfig;
  })() : (function () {
    log("[INTERNAL]", "Config file not found. Creating a default one...");
    try {
      fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify(defaultconfig, null, 4), {
        mode: 0o666
      });
    } catch (ex) {
      log("[INTERNAL]", "Cannot write default config, returned an error: ", ex);
    }
    return defaultconfig;
  })();
};
