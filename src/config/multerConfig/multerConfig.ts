import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

// type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void;

// export const multerConfig = {

//   storage : multer.diskStorage({
//     destination: 'src/uploads/',
//     filename: function (req: Request, file: Express.Multer.File, cb: FileNameCallback) {
//       cb(null, file.originalname);
//     }
//   }),

//   fileFilter :(req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
//     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
//       console.log(file.originalname)
//       return cb(null, false);
//     }
//     cb(null, true);
//   }

// }

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/images");
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, `${Date.now()}-${originalname}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000000, files: 5 },
});

export default upload;
