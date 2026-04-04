import { registry } from "../config/swagger.js";
import { authSwaggerDocs } from "./docs/auth.js";
import { userSwaggerDocs } from "./docs/users.js";
import { announcementSwaggerDocs } from "./docs/announcements.js";

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

