/**
 * Created by Andriy Ermolenko on 13.07.15.
 */

/**
 * CORS middleware
 * @return {Function}
 */
exports.cors = function() {
    return function(req, res, next) {
        // allowed domains (F - add options)
        res.header('Access-Control-Allow-Origin', '*');
        // allowed methods
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        // allowed headers
        res.header('Access-Control-Allow-Headers', 'Content-Type, connectID');
        // call next handler
        next();
    };
};

/**
 * Log stream for logger
 * @return {*}
 */
exports.logStream = function() {
    var path = require('path');
    var config = require('./config');
    var fs = require('fs');
    // get filename from config
    var fileName = path.join(__dirname, config.get('app:log'));
    // create all sub-dirs
    makeFullPath(fileName);
    // create logstream
    return fs.createWriteStream(fileName, {flags: 'a'});
};

var makeFullPath = function(fileName) {
    var fs = require('fs');
    var path = require('path');
    var dirName = path.dirname(fileName);
    var subdirs = dirName.split(path.sep);
    var basePath = subdirs[0];
    for (var i=0;i<subdirs.length;i++) {
        if (('' !== basePath) && (!fs.existsSync(basePath))) fs.mkdirSync(basePath);
        if (i+1 < subdirs.length) basePath = path.join(basePath, path.sep, subdirs[i+1]);
    }
};