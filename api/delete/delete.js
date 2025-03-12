export default async function handleDelete(model, req, res) {
  const isId = parseInt(req.headers["x-del-id"]);
  if (!isId) {
    res.writeHead(400);
    return res.end(
      JSON.stringify({ error: "missing x-del-id in the request headers" })
    );
  }
  const isUser = await model.find({ id: isId }, { _id: 0, __v: 0 });
  if (isUser.length === 0) {
    res.writeHead(400);
    return res.end(
      JSON.stringify({ error: "There is no document with the specified id" })
    );
  }
  const toDelete = await model.findOneAndDelete({ id: isId });
  if (!toDelete) {
    res.writeHead(500);
    return res.end(
      JSON.stringify({ error: "server failed to delete the user" })
    );
  }
  res.writeHead(200);
  return res.end(JSON.stringify({ success: "user is deleted" }));
}
