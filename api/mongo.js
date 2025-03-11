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
      req.on("end", async () => {
        const hasNameExist = await isModel.exists({
          name: { $regex: new RegExp(`^${isBody.name}$`, "i") },
          email: { $regex: new RegExp(`^${isBody.email}$`, "i") },
        });
        if (hasNameExist === null) {
          const lastId = await isModel.find({}, { _id: 0 }).sort({
            id: -1,
          });
          const isId = lastId ? lastId + 1 : 1;
          const toCreate = await isModel.create(
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
      });
      break;
    default:
      res.writeHead(405);
      res.end(JSON.stringify({ error: "Method not allowed" }));
      break;
  }
}
