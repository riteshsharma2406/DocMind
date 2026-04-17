// when the file come where should I store it and what should I name it
const multer = require('multer');

const storage = multer.diskStorage({
    destination: "uploads/", //stores the file in uploads

    filename: (req, file, cb)=>{ 
        cb(null, Date.now()+ "-" + file.originalname) //keep originalname + unique prefix
    }

})

const upload = multer({storage});

module.exports = { upload };



