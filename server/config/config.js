 // ==========
 // Puerto
 // ==========

 process.env.PORT = process.env.PORT || 3000;



 // ==========
 // Entorno
 // ==========
 process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


 // ==========
 // Vencimiento del token
 // ==========
process.env.CADUCIDAD_TOKEN = '48h';



 // ==========
 // SEED de autenticación
 // ==========
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';

 // ==========
 // Base de datos
 // ==========

let urlBD;

if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = process.env.MONGO_URI;
}

process.env.URLBD = urlBD;

 // ==========
 // Google client ID
 // ==========
process.env.CLIENT_ID =
  process.env.CLIENT_ID || '1011267387243-ka2s03brdkgvnkdmplhlfqb9jvcv56cf.apps.googleusercontent.com';

