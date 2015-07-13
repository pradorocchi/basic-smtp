/**
 * Created by Andriy Ermolenko on 7/29/14.
 * NConf configuration
 */
var nconf = require('nconf');

nconf.argv().env().file({file: './config.json' });

module.exports = nconf;