export default async function handleRead(model, res) {
  const data = await model.find({}, { _id: 0, __v: 0 });
  if (!Array.isArray(data)) {
    res.writeHead(500);
    return res.end(JSON.stringify({ error: "server failed to fetch data" }));
  }
  res.writeHead(200);
  return res.end(JSON.stringify(data));
}
