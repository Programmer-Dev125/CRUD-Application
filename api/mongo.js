import mongoose, { Schema } from "mongoose";
import handleRead from "./read/read.js";
import handleCreate from "./create/create.js";
import handleUpdate from "./put/put.js";
import handleDelete from "./delete/delete.js";

const URL = process.env.MONGO_URL;
const isColl = process.env.COLLECTION;
const ApiKey = process.env.API_KEY;

const conn = await mongoose.createConnection(URL);

if (!conn) {
  throw new Error("Connection not made");
}

const schemaOptions = {
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
};

const userModel = conn.model("isModel", new Schema(schemaOptions), isColl);
export default async function handleServer(req, res) {
  res.setHeader(
    "access-control-allow-origin",
    "https://crud-application-nine-kohl.vercel.app"
  );
  res.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "access-control-allow-headers",
    "content-type, x-put-id, x-del-id, authorization"
  );
  res.setHeader("content-type", "application/json");

  const isAuthorize = req.headers.authorization;
  if (!isAuthorize) {
    res.writeHead(400);
    return res.end(JSON.stringify({ error: "Lacks api key" }));
  }

  if (isAuthorize !== ApiKey) {
    res.writeHead(401, { "www-authenticate": "Bearer API_TOKEN" });
    return res.end(JSON.stringify({ error: "Invalid Authentication key" }));
  }

  switch (req.method) {
    case "OPTIONS":
      res.writeHead(200);
      res.end();
      break;
    case "GET":
      handleRead(userModel, res);
      break;
    case "POST":
      handleCreate(userModel, req, res);
      break;
    case "PUT":
      handleUpdate(userModel, req, res);
      break;
    case "DELETE":
      handleDelete(userModel, req, res);
      break;
    default:
      res.writeHead(405);
      res.end(JSON.stringify({ error: "Invalid request method" }));
      break;
  }
}
