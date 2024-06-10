import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/categories/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const catetgoryFileUpload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) { 
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/webp"
    ) {
      callback(null, true);
    } else {
      console.log("Only JPG, JPEG, PNG, and WEBP files are supported!");
      callback(null, false);
    }
  },
});

export { catetgoryFileUpload };


