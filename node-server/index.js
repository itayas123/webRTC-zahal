const app = require("express")();
const cors = require("cors");
app.use(cors());
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 3001;
server.listen(port, () => console.log(`Listening on port ${port}...`));

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

const { start, kurentoCandidate } = require("./routes/kurento");
io.on("connection", socket => {
  console.log("socket connected");
  socket.on("start", ({ sdpOffer, url, _id }) =>
    start(sdpOffer, url, _id, socket)
  );
  socket.on("candidate", ({ candidate, id }) =>
    kurentoCandidate(candidate, id)
  );
});

module.exports = server;
