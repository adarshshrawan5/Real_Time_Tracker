const express = require('express');
const path = require('path');
const app = express();

const http = require('http');

const sockit = require('socket.io');
const server = http.createServer(app);
const io = sockit(server);

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

io.on("connection", function (socket) {
    console.log("User connected:", socket.id);

    socket.on("send-location", function (data) {
        console.log("Location from:", socket.id);
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", function () {
        console.log("User disconnected:", socket.id);
        io.emit("user-disconnected", socket.id);
    });
});

app.get("/",function (req,res) {
    res.render("index");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0" , function(){
    const actualPort = server.address() && server.address().port;
    console.log(`Server running on http://localhost:${actualPort}`);
});

