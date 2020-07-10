const mongoose = require("mongoose");
const dotenv = require("dotenv").config({ path: "./config.env" });
const app = require("./app");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
app.io = io;
const key = require("./config/keys");

mongoose
  .connect(key.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log("Waiting for requests ..."))
  .catch((error) => {
    console.log("Failed to Connect to database!");
    console.log(error);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`App running at port ${PORT}`);
});

io.on("connection", (socket) => {
  app.socket = socket;
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!\n Server Shutting Down!");
  console.log(err);
  console.log(err.name, err.message);
  process.exit();
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!\n Server Shutting Down!");
  console.log(err.stack);
  console.log(err.name, err.message);
  process.exit();
});

server.on("close", () => console.log("Server now turned off! "));

exports.socketIOClient = io;
