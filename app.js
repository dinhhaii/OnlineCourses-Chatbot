const express = require ('express');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const constant = require('./utils/constant');

const indexRouter = require('./routes/index');
const webhookRouter = require('./routes/webhook');

require('dotenv').config();
const app = express();

const port = process.env.PORT || 3003;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


// View engine setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cors());

// Router
app.use('/', indexRouter);
app.use('/webhook', webhookRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error Handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  res.send(err);
});

module.exports = app;
