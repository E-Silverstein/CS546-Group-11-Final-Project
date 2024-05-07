/*
    multer: middleware for handling file inputs
    - upload: defines where the uploaded files are stores -> '/uploads' folder
    - storage: 
    -   files will be stored in the ./uploads folder
    -   files will keep their original name rather than be encoded

*/
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Math.floor(Math.random()* 10000) + "-" + file.originalname.toLowerCase());
    }
})

const upload = multer({ storage: storage });
export {upload}