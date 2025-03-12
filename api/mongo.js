import mongoose, { Schema } from "mongoose";

const URL = process.env.MONGO_URL;
const coll = process.env.COLLECTION;

if (!URL) {
  throw new Error("Mongo URL is not defined in environment variables");
}

const conn = mongoose.createConnection(URL);
const isModel = conn.model(
  "myModel",
  new Schema({ id: Number, name: String, age: Number, email: String }),
  coll
);

await conn.asPromise();

export default async function handleServer(req, res) {
  res.setHeader(
    "access-control-allow-origin",
    "https://crud-application-nine-kohl.vercel.app"
  );
  res.setHeader("access-control-allow-methods", "GET, DELETE, POST, PUT");
  res.setHeader("content-type", "application/json");
  res.setHeader(
    "access-control-allow-headers",
    "content-type, x-user-id, authorization"
  );

  switch (req.method) {
    case "OPTIONS":
      res.writeHead(200);
      res.end();
      break;
    case "GET":
      const data = await isModel.find({}, { _id: 0, __v: 0 });
      if (Array.isArray(data)) {
        res.writeHead(200);
        res.end(JSON.stringify(data));
      } else {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Error fetching data" }));
      }
      break;
    case "POST":
      let isBody;
      req.on("data", (data) => {
        isBody = JSON.parse(data.toString());
      });
      req.on("end", () => {
        (async () => {
          const hasNameExist = await isModel.exists({
            name: { $regex: new RegExp(`^${isBody.name}$`, "i") },
          });
          const hasEmailExist = await isModel.exists({
            email: { $regex: new RegExp(`^${isBody.email}$`, "i") },
          });
          if (hasNameExist === null && hasEmailExist === null) {
            const lastId = await isModel.findOne({}, { _id: 0 }).sort({
              id: -1,
            });
            const isId = lastId ? lastId + 1 : 1;
            const toCreate = await isModel.insertMany(
              {
                id: isId,
                name: isBody.name,
                age: parseInt(isBody.age),
                email: isBody.email,
              },
              { ordered: true }
            );
            if (toCreate) {
              res.writeHead(201);
              res.end(JSON.stringify({ success: "User Submitted" }));
            } else {
              res.writeHead(400);
              res.end(JSON.stringify({ error: "Error submitting data" }));
            }
          } else {
            res.writeHead(409);
            res.end(
              JSON.stringify({ error: "Username or email already exists" })
            );
          }
        })();
      });
      break;
    case "PUT":
      const putId = parseInt(req.headers["x-user-id"]);
      let putData;
      req.on("data", (data) => {
        putData = JSON.parse(data.toString());
      });
      req.on("end", () => {
        (async () => {
          const toUpdate = await isModel.updateOne(
            { id: putId },
            {
              name: putData.name,
              age: parseInt(putData.age),
              email: putData.email,
            }
          );
          if (toUpdate.modifiedCount === 1) {
            res.writeHead(200);
            res.end(
              JSON.stringify({ success: "The user credentials are updated" })
            );
          } else {
            res.writeHead(400);
            res.end(
              JSON.stringify({ error: "Error updating the user credentials" })
            );
          }
        })();
      });
      break;
    case "DELETE":
      const delId = parseInt(req.headers["x-del-id"]);
      const hasDelete = await isModel.deleteOne({ id: delId });
      if (hasDelete.deletedCount === 1) {
        res.writeHead(200);
        res.end(JSON.stringify({ success: "The user has been deleted" }));
      } else {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Error deleting the user" }));
      }
      break;
    default:
      res.writeHead(405);
      res.end(JSON.stringify({ error: "Method not allowed" }));
      break;
  }
}
