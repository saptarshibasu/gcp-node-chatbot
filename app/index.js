require('express-async-errors');
const winston = require('winston');
const express = require('express');
const config = require('config');
const http = require('http');
const compression = require('compression');
const helmet = require('helmet');
const grocery = require('./routes/grocery');
const error = require('./middleware/error');

const app = express();
winston.configure({transports: [new winston.transports.File({ filename: 'logfile.log' }) ]});
app.use(helmet());
app.use(express.json());
app.use(compression());

app.use(express.static('public'));

app.use('/api', grocery);

app.use(error);

const port = process.env.APP_PORT || 4000;
const appName = config.get('app_name');

const httpServer = http.createServer(app);
httpServer.listen(port, () => console.log(`${appName} Listening on port ${port}...`));
