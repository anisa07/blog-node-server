import mongoose from 'mongoose';
import GridFsStorage from 'multer-gridfs-storage';
import multer from 'multer';
import crypto from "crypto";
import path from "path";

const dbUrl = process.env.DATABASE_URL as string;

const connectDb = () => {
    return mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
};

const storage = new GridFsStorage({
    url: dbUrl,
    file: (_req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: "uploads"
          };
          resolve(fileInfo);
        });
      });
    }
  });
  
const upload = multer({
    storage
});

export {
    storage,
    upload
};

export default connectDb;
