const multer = require('multer');
const fs = require('fs');

// Diretório de uploads
const uploadDestination = './uploads/';
if (!fs.existsSync(uploadDestination)) {
  fs.mkdirSync(uploadDestination);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDestination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileUpload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 } // Limite de 5MB
}).single('avatar'); // 'avatar' é o nome do campo do formulário onde o arquivo será enviado

module.exports = fileUpload;
