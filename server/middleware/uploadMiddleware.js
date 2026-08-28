import multer from "multer";

// Store uploaded file temporarily in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter: (req, file, cb) => {
    const isCSV =
      file.mimetype === "text/csv" ||
      file.originalname.toLowerCase().endsWith(".csv");

    if (!isCSV) {
      return cb(
        new Error("Only CSV files are allowed")
      );
    }

    cb(null, true);
  },
});

export default upload;