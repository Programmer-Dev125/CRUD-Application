export default async function handleCreate(model, req, res) {
  let isPostBody = "";
  req.on("data", (data) => {
    isPostBody += data;
  });

  req.on("end", () => {
    const isPostObj = JSON.parse(isPostBody);
    if (!Object.hasOwn(isPostObj, "name")) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: "Request body missing" }));
    }
    (async () => {
      const isExist = await model.exists({
        $or: [
          { name: { $regex: new RegExp(`^${isPostObj.name}`, "i") } },
          { email: { $regex: new RegExp(`^${isPostObj.email}`, "i") } },
        ],
      });
      if (isExist !== null) {
        res.writeHead(400);
        return res.end(
          JSON.stringify({ error: "username or email already exists" })
        );
      }
      const lastId = await model.findOne().sort({ _id: -1 }).lean();
      const isId = lastId?.id ? lastId.id + 1 : 1;
      const toInsert = {
        id: isId,
        name: isPostObj.name,
        age: parseInt(isPostObj.age),
        email: isPostObj.email,
      };
      const toCreate = await model.create([toInsert], { ordered: true });
      if (!toCreate) {
        res.writeHead(500);
        return res.end(JSON.stringify({ error: "Failed to submit user" }));
      }
      res.writeHead(201);
      return res.end(JSON.stringify({ success: "user submitted" }));
    })();
  });
}
