const express = require('express');
const cors = require ('cors');
require('dotenv').config({ path : './.env'});

const createCheckoutSession = require('./api/checkout');
const webhook = require('./api/webhook');

const app = express();
const port = 8080;

app.use(function (req, res, next) {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
    );
    next();
  });

app.use(express.json({
    verify: ( req, res, buffer) => req['rawbody'] = buffer   
}));

app.use(cors({ origin : true }));

app.get('/', (req, res) => res.send('hello'));

app.post('/create-checkout-session', createCheckoutSession);

//webhook
app.post('/webhook', webhook)

app.listen(port, ()=> console.log('server listening on port',port))