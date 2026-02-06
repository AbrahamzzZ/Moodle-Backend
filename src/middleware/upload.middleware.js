import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {

        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (req, file, cb) => {


        const allowedMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
        ];


        const allowedExtensions = ['.pdf', '.doc', '.docx'];

        const fileExt = path.extname(file.originalname).toLowerCase();

        if (
            allowedMimeTypes.includes(file.mimetype) &&
            allowedExtensions.includes(fileExt)
        ) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    'Tipo de archivo no permitido. Solo PDF, DOC o DOCX.'
                ),
                false
            );
        }
    },
});

export default upload;