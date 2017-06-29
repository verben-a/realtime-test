var express = require('express');
var bodyParser = require('body-parser');

var www = express.static('public');
var api = require('./api/app.js');

express()
  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json())
  .use('/api', api)
  .use('/', www)
  .listen(process.env.PORT || 8888);