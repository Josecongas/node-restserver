const express = require('express');
const app = express();


/////////// RUTAS /////////////

// Usuario
app.use(require('./usuario'));

// Login
app.use(require('./login'));

module.exports = app;
