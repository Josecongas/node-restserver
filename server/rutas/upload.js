const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files) {
    return res.status(400)
        .json({
            ok: false,
            err: {
                message: 'no se ha seleccionado ningún archivo'
            }
        });
}

    // Valida tipo

    let tiposValidos = ['producto', 'usuario'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res
          .status(400)
          .json({
            ok: false,
            err: {
              message: 'Tipo de archivo no permitido, los archivos permitidos son: ' + tiposValidos
            }
          });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];    

    // Extensiones permitidas

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extensión no permitida'
            }
        })
    }

    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
      if (err) return res.status(500).json({ ok: false, err: err });

      if (tipo === 'usuario') {
          imagenUsuario(id, res, nombreArchivo);
      } else if (tipo === 'producto') {
          imagenProducto(id, res, nombreArchivo);
      }
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuario');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuario');
            return res.status(400).json({ ok: false, err: {message: 'usuario no existe'} });
        }


        borraArchivo(usuarioDB.img, 'usuario');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                image: nombreArchivo
            })
        })
    })
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
      if (err) {
        borraArchivo(nombreArchivo, 'producto');
        return res.status(500).json({ ok: false, err });
      }

      if (!productoDB) {
        borraArchivo(nombreArchivo, 'producto');
        return res
          .status(400)
          .json({ ok: false, err: { message: 'producto no existe' } });
      }

      borraArchivo(productoDB.img, 'producto');

      productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
          res.json({
            ok: true,
            producto: productoGuardado,
            image: nombreArchivo
          });
        });
    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;
