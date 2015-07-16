/**
 * Created by Andriy Ermolenko on 7/28/14.
 * Main Node.JS Server
 */

/**
 * Module dependencies
 */

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var routes = require('./routes');
var path = require('path');
var config = require('./api/config');
var cors = require('./api/util').cors;
var logStream = require('./api/util').logStream;
var favicon = require('serve-favicon');
var compression = require('compression');
// session support
var session = require('express-session');
var sessionStore = new session.MemoryStore();
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


/**
 * Configure Server
 */

// express application
var app = module.exports = express();

var transport = nodemailer.createTransport(smtpTransport({
        host: config.get('mail:smtp:host'),
        port: config.get('mail:smtp:port'),
        auth: {
            user: config.get('mail:smtp:user'),
            pass: config.get('mail:smtp:pass')
        }
    }));

/**
 * Defaults
 */

/**
 * Express Configuration
 */

// set application port
app.set('port', process.env.PORT || config.get('app:port'));
// set 'views' path
app.set('views', __dirname + '/views');
// set page render engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// logs
app.use(morgan('dev', {stream: logStream()}));
// enable CORS
if (config.get('app:cors')) app.use(cors());
// set body parser (for JSON body)
app.use(bodyParser.urlencoded({
    limit: config.get('app:maxRequestSize'),
    extended: true
}));
app.use(bodyParser.json({limit: config.get('app:maxRequestSize')}));
// set POST, DELETE, etc
app.use(methodOverride());
// use compression
app.use(compression());
// set path for static server folder
app.use(express.static(path.join(__dirname, 'public')));
// set session
app.use(session({
    secret: config.get('app:secret'),
    resave: true,
    saveUninitialized: true,
    cookie: {
        expires: false,
        secure: true
    },
    store: sessionStore
}));
app.use(cookieParser(config.get('app:secret')));
// favicon
app.use(favicon(__dirname + '/public/favicon.png'));

/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);

// redirect all others to the error page
app.get('*', routes.error);

app.post('/send', function(req, res) {
    var mail = {
        from: req.body.from,
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.message
    };
    if (transport) {
        transport.sendMail(mail, function(error, info) {
            if (error) res.send({
                status: 'ERR',
                text: error
            });
            else res.send({
                status: 'OK',
                text: info.response
            });
        });
    }
    else throw "Check your SMTP config";
});

// start APP
app.listen(config.get('app:port'));
// start SMTP
smtpServer.listen(config.get('smtp:port'));