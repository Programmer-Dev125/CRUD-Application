import http from "node:http";
import mongoose, { Schema } from "mongoose";

const conn = mongoose.createConnection("mongodb://localhost:27017/users");
const UserModel = conn.model(
  "MyModel",
  new Schema({
    id: { type: Number, unique: true },
    name: { type: String, unique: true },
    age: String,
    email: { type: String, unique: true },
  }),
  "user"
);

const server = http.createServer(async (req, res) => {
  req.setEncoding("utf-8");
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "access-control-allow-headers",
    "content-type, authorization, x-user-id"
  );

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  switch (true) {
    case req.method === "GET" && req.url === "/users":
      const data = await UserModel.find({}, { _id: 0, __v: 0 });
      if (Array.isArray(data)) {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(data));
      } else {
        res.writeHead(500, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Server failed to fetch data from the database",
          })
        );
      }
      break;
    case req.method === "POST" && req.url === "/users":
      let isBody;
      req.on("data", (data) => {
        isBody = JSON.parse(data);
      });
      req.on("end", async () => {
        const isExists = await UserModel.exists({
          name: { $regex: new RegExp(`^${isBody.name}$`, "i") },
        });
        if (isExists === null) {
          const lastUser = await UserModel.findOne({}, { _id: 0, id: 1 }).sort({
            id: -1,
          });
          const isId = lastUser ? lastUser.id + 1 : 1;
          const obj = { id: isId, ...isBody };
          const data = await UserModel.insertMany(obj, { ordered: true });
          if (data) {
            res.writeHead(201, { "content-type": "application/json" });
            res.end(JSON.stringify({ message: "User submitted" }));
          } else {
            res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify({ message: "Error submitting user" }));
          }
        } else {
          res.writeHead(409, { "content-type": "application/json" });
          res.end(JSON.stringify({ message: "username already exists" }));
        }
      });
      break;
    case req.method === "PUT" && req.url === "/users":
      const isId = parseInt(req.headers["x-user-id"]);
      let putData;
      req.on("data", (data) => {
        putData = JSON.parse(data);
      });
      req.on("end", async () => {
        const toUpdate = await UserModel.updateOne({ id: isId }, putData);
        if (toUpdate.modifiedCount === 1) {
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify({ message: "The resource is updated" }));
        } else {
          res.writeHead(400, { "content-type": "application/json" });
          res.end(JSON.stringify({ message: "The resource is not updated" }));
        }
      });
      break;
    case req.method === "DELETE" && req.url === "/users":
      const delId = parseInt(req.headers["x-user-id"]);
      (async () => {
        const isDeleted = await UserModel.deleteOne({ id: delId });
        if (isDeleted.deletedCount === 1) {
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify({ message: "The resource has been deleted" }));
        } else {
          res.writeHead(500, { "content-type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Server has failed to delete the resource",
            })
          );
        }
      })();
      break;
    default:
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "An Error" }));
      break;
  }
});

server.listen(3000, "localhost", () => {
  console.log("The server is live at: http://localhost:3000");
});
