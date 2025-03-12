import mongoose, { Schema } from "mongoose";

const URL = process.env.MONGO_URL;
const coll = process.env.COLLECTION;

if (!URL) {
  throw new Error("Mongo URL is not defined in environment variables");
}

const conn = await mongoose.createConnection(URL).asPromise();

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
        res.end(JSON.stringify({ error: "server failed to fetch data" }));
      }
      break;
    case "POST":
      let isPostBody = "";
      req.on("data", (data) => {
        isPostBody += data;
      });
      req.on("end", () => {
        const isObj = JSON.parse(isPostBody);
        if (!Object.hasOwn("isObj", "name")) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: "Missing Request body" }));
        }

        (async () => {
          const hasNameExist = await isModel.findOne({
            $or: [
              { name: { $regex: new RegExp(`^${isObj.name}`, "i") } },
              { email: { $regex: new RegExp(`^${isObj.email}`, "i") } },
            ],
          });
          if (!Object.hasOwn(hasNameExist, "name")) {
            res.writeHead(409);
            return res.end(
              JSON.stringify({
                error: "name or email already exists, change either of them",
              })
            );
          }
          const lastId = await isModel.findOne().sort({ _id: -1 }).lean();
          const isId = lastId?.id ? lastId + 1 : 1;
          const toCreate = await isModel.create(
            {
              id: isId,
              name: isObj.name,
              age: parseInt(isObj.age),
              email: isObj.email,
            },
            { ordered: true }
          );
          if (!Object.hasOwn(toCreate, "name")) {
            res.writeHead(400);
            return res.end(
              JSON.stringify({ error: "Error creating resource" })
            );
          }
          res.writeHead(201);
          return res.end(JSON.stringify({ success: "The user is created" }));
        })();
      });
      break;

    default:
      res.writeHead(405);
      res.end(JSON.stringify({ error: "Method not allowed" }));
      break;
  }
}
