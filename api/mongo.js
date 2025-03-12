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

  try {
    switch (req.method) {
      case "OPTIONS":
        res.writeHead(200);
        return res.end();

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
          if (!isPostBody) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: "Missing Request body" }));
          }
          (async () => {
            const isObj = JSON.parse(isPostBody);
            const hasNameExist = await isModel.findOne({
              $or: [
                { name: { $regex: new RegExp(`^${isObj.name}`, "i") } },
                { email: { $regex: new RegExp(`^${isObj.email}`, "i") } },
              ],
            });
            if (hasNameExist) {
              res.writeHead(409);
              return res.end(
                JSON.stringify({
                  error: "name or email already exists, change either of them",
                })
              );
            }
            const lastId = await isModel.findOne().sort({ _id: -1 }).lean();
            const isId = lastId?.id ? lastId + 1 : 1;
            const toCreate = await isModel.create({
              id: isId,
              name: isObj.name,
              age: parseInt(isObj.age),
              email: isObj.email,
            });
            if (!toCreate) {
              res.writeHead(400);
              return res.end(
                JSON.stringify({ error: "Error creating resource" })
              );
            }
            res.writeHead(201);
            res.end(JSON.stringify({ success: "The user is created" }));
          })();
        });
        break;

      // case "PUT":
      //   const putId = parseInt(req.headers["x-user-id"]);
      //   let putData = "";
      //   req.on("data", (chunk) => {
      //     putData += chunk;
      //   });

      //   req.on("end", async () => {
      //     try {
      //       if (!putData) {
      //         res.writeHead(400);
      //         return res.end(JSON.stringify({ error: "Empty request body" }));
      //       }

      //       const isPutObj = JSON.parse(putData);
      //       const toUpdate = await isModel.updateOne(
      //         { id: putId },
      //         {
      //           name: isPutObj.name,
      //           age: parseInt(isPutObj.age),
      //           email: isPutObj.email,
      //         }
      //       );

      //       if (toUpdate.modifiedCount === 1) {
      //         res.writeHead(200);
      //         res.end(
      //           JSON.stringify({ success: "The user credentials are updated" })
      //         );
      //       } else {
      //         res.writeHead(400);
      //         res.end(
      //           JSON.stringify({ error: "Error updating the user credentials" })
      //         );
      //       }
      //     } catch (err) {
      //       res.writeHead(400);
      //       res.end(JSON.stringify({ error: "Invalid JSON format" }));
      //     }
      //   });
      //   break;

      // case "DELETE":
      //   const delId = parseInt(req.headers["x-del-id"]);
      //   const hasDelete = await isModel.deleteOne({ id: delId });
      //   if (hasDelete.deletedCount === 1) {
      //     res.writeHead(200);
      //     res.end(JSON.stringify({ success: "The user has been deleted" }));
      //   } else {
      //     res.writeHead(400);
      //     res.end(JSON.stringify({ error: "Error deleting the user" }));
      //   }
      //   break;

      default:
        res.writeHead(405);
        res.end(JSON.stringify({ error: "Method not allowed" }));
    }
  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}
