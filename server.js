const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "data", "db.json"));
const middlewares = jsonServer.defaults();

// Serve static files from public folder
server.use(jsonServer.defaults({ static: path.join(__dirname, "public") }));

const PORT = process.env.PORT || 8080;

server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});