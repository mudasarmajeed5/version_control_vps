const http = require('http')
http.createServer(
function(req, res){
res.write("On the way to being full stack engineer");
res.end();
}
).listen(3000)


console.log("Server is Running on PORT, 3000")

