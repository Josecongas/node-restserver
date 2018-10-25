const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion');


app.get('/usuario', verificaToken, function (req, res) {


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


        Usuario.find({status: true}, 'nombre email role estado google img')
          .skip(desde)
          .limit(limite)
          .exec((err, usuarios) => {
            if (err) {
              return res.status(400).json({ ok: false, err: err });
            }

              Usuario.count({ status: true}, (err, contador) => {
                res.json({ ok: true, usuarios: usuarios, total: contador });
            })

          }); 

});

app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err: err
      });
    } else {
      // usuarioDB.password = null;

      res.json({
        ok: true,
        usuario: usuarioDB
      });
    }
  });
});

app.put('/usuario/:id', verificaToken , function(req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true, context: 'query' },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err: err
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB
      });
    }
  );
});

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(
  req,
  res
) {
  let id = req.params.id;

  Usuario.findByIdAndUpdate(id, { status: false }, (err, usuarioBorrado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err: err
      });
    }

    if (!usuarioBorrado) {
      return res
        .status(400)
        .json({ ok: false, err: { message: 'Usuario no encontrado' } });
    }

    usuarioBorrado.status = false;

    res.json({
      ok: true,
      usuario: usuarioBorrado
    });
  });
});

module.exports = app
