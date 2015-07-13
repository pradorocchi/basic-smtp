# basic-smtp
Basic Express app with SMTP support

## Configure
For configuring app, change options in `config.json` file:

```javascript
  {
    app: {
      port: 'Application port',
      secret: 'Session secret',
      maxRequestSize: 'Max size for POST request',
      log: 'Path to log',
      cors: 'Enable CORS (true/false)'
    },
    smtp: {
      port: 'Port for built-in SMTP server'
    }
  }
```
  
 
  