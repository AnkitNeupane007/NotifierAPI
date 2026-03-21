import { registry } from "../config/swagger.js";
import { authSwaggerDocs } from "./docs/authDocs.js";
import { userSwaggerDocs } from "./docs/userDocs.js";
import { announcementSwaggerDocs } from "./docs/announcementDocs.js";

const registerDocs = () => {
  // Register Auth Docs
  Object.values(authSwaggerDocs).forEach((doc) => {
    registry.registerPath(doc);
  });

  // Register User Docs
  Object.values(userSwaggerDocs).forEach((doc) => {
    registry.registerPath(doc);
  });

  // Register Announcement Docs
  Object.values(announcementSwaggerDocs).forEach((doc) => {
    registry.registerPath(doc);
  });
};

export default registerDocs;

