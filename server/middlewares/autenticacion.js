const jwt = require('jsonwebtoken');

// ========================
// VERIFICAR TOKEN
// ========================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
      if (err) {
        return res.status(401).json({
           ok: false,
            err: {
              message: 'Token no válido'
            } });
      }

      req.usuario = decoded.usuario;
      next();
    });
}

// ========================
// VERIFICAR ROL ADMIN
// ========================

let verificaAdmin_Role = (req, res, next) => {
  let usuario = req.usuario;
  
  if (usuario.role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      ok: false,
      err: {
        message: 'El usuario debe ser administrador'
      }
    });
  }

  next();
}

module.exports = {
  verificaToken,
  verificaAdmin_Role
};