const express = require('express');

let {
  verificaToken,
  verificaAdmin_Role
} = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');

// ============================
// Mostrar todas las categorías
// ============================
app.get('/categoria', (req, res) => {
  Categoria.find({})
  .sort('descripcion')
  .populate('usuario', 'nombre, email')
  .exec((err, categorias) => {
    if (err) {
      return res.status(400).json({ ok: false, err: err });
    }

    Categoria.count({ status: true }, (err, contador) => {
      res.json({
        ok: true,
        categorias: categorias,
        total: contador
      });
    });
  });
});

// ============================
// Mostrar una categoría por id
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {
  let id = req.params.id;

  Categoria.findById(id)
  .exec((err, categoria) => {
    if (err) {
      return res.status(400).json({ ok: false, err: err });
    }

    Categoria.count({ status: true }, (err, contador) => {
      res.json({
        ok: true,
        categoria: categoria
      });
    });
  });
});

// ============================
// Crear nueva categoría
// ============================
app.post('/categoria', verificaToken, (req, res) => {
  // devuelve la nueva categoría
  // req.usuario._id

  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: err
      });
    }
    res.json({ ok: true, categoria: categoriaDB });
  });
});

// ============================
// Actualizar una categoría
// ============================
app.put('/categoria/:id', (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let descCategoria = {
    descripcion: body.descripcion
  };

  Categoria.findByIdAndUpdate(
    id,
    descCategoria,
    { new: true, runValidators: true, context: 'query' },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err: err
        });
      }

      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err: err
        });
      }

      res.json({
        ok: true,
        categoria: categoriaDB
      });
    }
  );
});

// ============================
// Borra una categoría
// ============================
app.delete(
  '/categoria/:id',
  [verificaToken, verificaAdmin_Role],
  (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err: err
        });
      }

      if (!categoriaBorrada) {
        return res.status(400).json({
          ok: false,
          err: { message: 'Categoria no encontrada' }
        });
      }

      res.json({
        ok: true,
        message: { message: 'Categoria borrada' },
        categoria: categoriaBorrada
      });
    });
  }
);

module.exports = app;
