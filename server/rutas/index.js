const express = require('express');
const app = express();


/////////// RUTAS /////////////

// Usuario
app.use(require('./usuario'));

// Categoria
app.use(require('./categoria'));

// Producto
app.use(require('./producto'));

// Login
app.use(require('./login'));

module.exports = app;
