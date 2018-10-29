const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./config/config');
const path = require('path');

const mongoose = require('mongoose');
const colors = require('colors');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// Habilitar la carpeta Public
app.use(express.static(path.resolve(__dirname, '../public')));
console.log(path.resolve(__dirname, '../public'));



//////////// RUTAS /////////////
app.use(require('./rutas/index'));
////////////////////////////////



mongoose.connect(
  process.env.URLBD,
  (err, res) => {
    if (err) throw err;

    console.log('Base de datos ' + 'ONLINE'.green);
  }
);

app.listen(process.env.PORT, () => {
  console.log(`Escuchando puerto ${process.env.PORT}`);
});
