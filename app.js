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


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cors());

// Router
app.use('/', indexRouter);
app.use('/webhook', webhookRouter);

module.exports = app;
