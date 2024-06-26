require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars')
var fileUpload= require('express-fileupload')
// var db = require('./config/connection')
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var session = require('express-session')
const connectDB = require('./server/config/db')
const MongoStore = require('connect-mongo')




// var MongoDBStore = require('connect-mongodb-session')(session);
// var store = new MongoDBStore({
//   uri:'mongodb://127.0.0.1:27017/shopping',
//   collection:'user'
// });

// var app = express();
const app = express();

connectDB();

// db.connect((err)=>{
//   if(err)
//   console.log("connection error"+err);
// else
//   console.log("database connected successfully");
// })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout',partialsDir:__dirname+'/views/partials'}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:"keyboard cat", 
  saveUninitialized: true,
  resave:false,
  store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
  }),
  // cookie:{
  //     maxAge: 60000,
     
  //   },
  }))

app.use(fileUpload())
app.use('/', userRouter);

app.use('/admin', adminRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;

