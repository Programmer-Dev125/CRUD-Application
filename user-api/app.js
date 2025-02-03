import http from "node:http";

const data = [
  { id: 1, name: "John Doe", age: 25, email: "johndoe@gmail.com" },
  { id: 2, name: "Jane Doe", age: 20, email: "janedoe@gmail.com" },
];

const server = http.createServer((req, res) => {
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
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(data));
      break;
    case req.method === "POST" && req.url === "/users":
      let isBody;
      req.on("data", (data) => {
        isBody = JSON.parse(data.toString());
      });
      req.on("end", () => {
        const isObj = { id: data.length + 1, ...isBody };
        const ln = data.length;
        data.push(isObj);
        console.log(data);
        if (data.length > ln) {
          console.log("is Inside");
          res.writeHead(201, { "content-type": "application/json" });
          res.end(JSON.stringify({ message: "Resource created" }));
        } else {
          res.writeHead(400, { "content-type": "application/json" });
          res.end(JSON.stringify({ message: "Incorrect data" }));
        }
      });
      break;
    case req.method === "PUT" && req.url === "/users":
      const isId = parseInt(req.headers["x-user-id"]);
      console.log(isId);
      let putData;
      req.on("data", (data) => {
        putData = JSON.parse(data.toString());
      });
      req.on("end", () => {
        let hasUpdated = false;
        for (let i = 0; i < data.length; i++) {
          if (data[i].id !== isId) {
            continue;
          }
          data[i].name = putData.name;
          data[i].age = putData.age;
          data[i].email = putData.email;
          hasUpdated = true;
        }
        if (hasUpdated) {
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify({ message: "Resource has been updated" }));
        } else {
          res.writeHead(400, { "content-type": "application/json" });
          res.end(JSON.stringify({ message: "Error updating the resource" }));
        }
      });
      break;
    case req.method === "DELETE" && req.url === "/users":
      const delId = parseInt(req.headers["x-user-id"]);
      console.log(delId);
      const isBeforeLength = data.length;
      for (let i = 0; i < data.length; i++) {
        if (data[i].id !== delId) continue;
        data.splice(i, 1);
      }
      if (isBeforeLength > data.length) {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "resource deleted successfully" }));
      } else {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "Error deleting the resource" }));
      }
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
