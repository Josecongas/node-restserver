const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

let rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es necesario']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El correo es necesario']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es necesaria']
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos,
    required: [true, 'El rol es necesario']
  },
  status: {
    type: Boolean,
    required: [true, 'El status es necesario'],
    default: true
  },
  google: {
    type: Boolean,
      required: [true, 'El tipo google es necesario'],
      default: false
  }
});

// Elimina el password del JSON de respuesta como medida de seguridad
usuarioSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
}

usuarioSchema.plugin( uniqueValidator, {
  message: '{PATH} debe de ser único'
})

module.exports = mongoose.model('Usuario', usuarioSchema);