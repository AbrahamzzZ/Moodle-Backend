import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = 'uploads';
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`);
  },
});

function createUpload({ allowedMimeTypes, allowedExtensions, maxSizeMb, errorMessage }) {
  return multer({
    storage,
    limits: { fileSize: maxSizeMb * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const fileExt = path.extname(file.originalname).toLowerCase();

      if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExt)) {
        cb(null, true);
      } else {
        cb(new Error(errorMessage), false);
      }
    },
  });
}

export const uploadDocument = createUpload({
  allowedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  ],
  allowedExtensions: ['.pdf', '.doc', '.docx'],
  maxSizeMb: 10,
  errorMessage: 'Tipo de archivo no permitido. Solo PDF, DOC o DOCX.',
});

export const uploadImage = createUpload({
  allowedMimeTypes: ['image/jpeg', 'image/png'],
  allowedExtensions: ['.jpg', '.jpeg', '.png'],
  maxSizeMb: 5,
  errorMessage: 'Tipo de imagen no permitido. Solo JPG o PNG.',
});


export function singleFile(uploader, field) {
  const middleware = uploader.single(field);
  return (req, res, next) =>
    middleware(req, res, error => {
      if (error) {
        const message =
          error.code === 'LIMIT_FILE_SIZE' ? 'El archivo supera el tamaño permitido.' : error.message;
        return res.status(400).json({ ok: false, message });
      }
      next();
    });
}
