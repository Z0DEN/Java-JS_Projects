const http = require("http");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
async function init() {
  console.log("Остановка сервера через 5 секунд");
  await delay(5000);
  server.close(() => console.log('Server stopped.'));
}
var server = http.createServer(function(request,response){
     
  response.end("Hello NodeJS!");
   
});
server.listen(3000, "127.0.0.1");
init()