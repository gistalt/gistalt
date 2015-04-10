var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var fs = require('fs')
var sesh = require('express-session')
var routes = require('./routes')
var config = require('./config')
var path = require('path')
var exphbs = require('express-handlebars')
var assets = JSON.parse( fs.readFileSync('public/dist/rev-manifest.json','utf-8') );
var app = express()

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(sesh({
  secret: config.session_secret,
  saveUninitialized: true,
  resave: true
}))

app.use(function(req,res,next){
  res.locals.session = req.session;
  res.locals.css = assets['public/dist/style.css'].replace('public','')
  res.locals.js =  assets['public/dist/app.js'].replace('public','')
  res.locals.callback_uri = config.callback_uri
  res.locals.client_id = config.client_id
  next();
});

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', routes.index)
app.get('/callback', routes.callback)
app.get('/login', routes.login)
app.get('/logout', routes.logout)
app.post('/update/:format?', routes.updateFile)
app.get('/new', routes.newGist)
app.post('/create', routes.create)
app.post('/fork', routes.fork)
app.post('/delete', routes.deleteGist )
app.get('/:id', routes.show)
app.get('/:id/:filename', routes.showFile)

module.exports = app;
