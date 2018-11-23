const express = require('express');
const {
  verificaToken,
  verificaAdmin_Role
} = require('../middlewares/autenticacion');

const app = express();
let Producto = require('../models/producto');

// ============================
// Obtener todos los productos
// ============================

app.get('/producto', verificaToken, (req, res) => {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);


  Producto.find({disponible: true})
    .skip(desde)
    .limit(limite)
    .populate('categoria', 'descripcion')
    .populate()
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({ ok: false, err: err });
      }

      Producto.count({ status: true }, (err) => {        
        res.json({ ok: true, productos: productos});
      })
    });
});

// ============================
// Obtener el producto por id
// ============================

app.get('/producto/:id', verificaToken, (req, res) => {

  
  let id = req.params.id;

  Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'descripcion')
    .exec((err, producto) => {
      if (err) {
        return res.status(500).json({ ok: false, err: err });
      }

      Producto.count({ status: true }, err => {
        res.json({ ok: true, producto: producto });
      });
    });
});


// ============================
// Buscar productos
// ============================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
  let termino = req.params.termino;

  let regex = new RegExp(termino, 'i');

  Producto.find({ nombre: regex})
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({ ok: false, err: err });
      }

      res.json({ ok: true, producto: productos });

    })
})


// ============================
// Crear el producto
// ============================

app.post('/producto', verificaToken, (req, res) => {
  let body = req.body;

  let producto = new Producto({
    usuario: body.usuario,
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({ ok: false, err: err });
    } else {
      res.status(201).json({ ok: true, producto: productoDB });
    }
  });
});

// ============================
// Actualizar el producto
// ============================

app.put('/producto/:id', verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Producto.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true, context: 'query' },
    (err, productoDB) => {
      if (err) {
        return res.status(500).json({ ok: false, err: err });
      }

      res.json({ ok: true, producto: productoDB });
    }
  );
});

// ============================
// Borrar el producto
// ============================

app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
  let id = req.params.id;

  Producto.findByIdAndUpdate(
    id,
    { disponible: false },
    (err, productoBorrado) => {
      if (err) {
        return res.status(400).json({ ok: false, err: err });
      }

      if (!productoBorrado) {
        return res.status(400).json({
          ok: false,
          err: { message: 'Producto no encontrado' }
        });
      }

      productoBorrado.status = false;

      res.json({
        ok: true,
        message: { message: 'Producto borrado' },
        categoria: productoBorrado
      });
    }
  );
});

module.exports = app;
