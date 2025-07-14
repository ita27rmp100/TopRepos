// needed packages
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {exec} = require("child_process")
const fs = require("fs")

const indexRouter = require('./routes/index');
const topReposRouter = require('./routes/country');
const loadingRouter = require("./routes/loading")

const app = express();
// working on data 
const countries = require("./countryList.json").countries.sort()
function RecursivePushCountryData(index){
  if(index<=countries.length){
    const country = countries[index]
    exec(`node filter.js ${country}`,(error,stdout,stderr)=>{
      if(error) console.log("Error :",error)
      setTimeout(()=>{RecursivePushCountryData(index+1)},5000)
    })
  }
}

setInterval(()=>{
  let lastUpdate = new Date(require("./countryList.json").LastUpdate)
  const current = new Date()
  if (Math.floor((current-lastUpdate)/(3600*1000))>24){
    fs.writeFileSync(
      path.join(__dirname, "countryList.json"),
      JSON.stringify({
        ...require("./countryList.json"),
        LastUpdate: new Date().toISOString().replace("T"," ").replace("Z","")
      }, null, 2)
    )
    RecursivePushCountryData(0)
  }
},10000)
// post data of form

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// use router
app.use('/', indexRouter);
app.use('/country', topReposRouter);
app.use('/load',loadingRouter)
app.use('/loading', loadingRouter);
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
