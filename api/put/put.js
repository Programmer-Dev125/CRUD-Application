export default async function handleUpdate(model, req, res) {
  const isId = parseInt(req.headers["x-put-id"]);
  if (!isId) {
    res.writeHead(400);
    return res.end(JSON.stringify({ error: "Missing x-put-id header" }));
  }
  let isPutBod = "";
  req.on("data", (data) => {
    isPutBod += data;
  });
  req.on("end", () => {
    const isPutObj = JSON.parse(isPutBod);
    if (!isPutObj) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: "Empty request body" }));
    }

    (async () => {
      const isDuplicate = await model.find({ id: isId }, { _id: 0, __v: 0 });
      if (!isDuplicate) {
        res.writeHead(400);
        return res.end(
          JSON.stringify({ error: "There's no user with the specified id" })
        );
      }
      for (let i = 0; i < isDuplicate.length; i++) {
        if (
          isDuplicate[i].name === isPutObj.name &&
          isDuplicate[i].age === isPutObj.age &&
          isDuplicate[i].email === isPutObj.email
        ) {
          res.writeHead(204);
          return res.end();
        }
      }
      const toUpdate = await model.updateOne(
        { id: isId },
        {
          name: isPutObj.name,
          age: parseInt(isPutObj.age),
          email: isPutObj.email,
        }
      );
      if (!toUpdate) {
        res.writeHead(500);
        return res.end(JSON.stringify({ error: "Failed to update user" }));
      }
      res.writeHead(200);
      return res.end(JSON.stringify({ success: "user updated" }));
    })();
  });
}
