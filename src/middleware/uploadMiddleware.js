import multer from "multer";
import AppError from "../utils/AppError.js"; // Optional: Use your custom error

const storage = multer.memoryStorage();

// Factory function to create configured multer instances
export const createUploader = (allowedTypes = [], maxSizeMB = 5) => {
  return multer({
    storage: storage,
    limits: {
      fileSize: maxSizeMB * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      // If no types specified, allow everything (generic)
      if (allowedTypes.length === 0) {
        return cb(null, true);
      }

      // Check if the uploaded file's mimetype matches any of the allowed types
      const isAllowed = allowedTypes.some((type) =>
        file.mimetype.startsWith(type),
      );

      if (isAllowed) {
        cb(null, true);
      } else {
        cb(
          new AppError(
            `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
            400,
          ),
          false,
        );
      }
    },
  });
};

// Pre-defining common uploaders for convenience:
export const uploadImage = createUploader(["image/"], 5); // Max 5MB images
export const uploadDocument = createUploader(
  ["application/pdf", "application/msword"],
  10,
); // Max 10MB docs

export const uploadImageAndDocs = createUploader(
  [
    "image/",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  10,
); // Max 10MB for images and docs

export const uploadAnything = createUploader(); // Generic, no type check, 5MB limit
