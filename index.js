const {objStr,strObj} = require('./modules/utils')
const {getuser,initusers, newuser} = require('./modules/user')
const fastify = require('fastify')()
fastify.register(require('fastify-websocket'))

const sendall = (data) => {
  fastify.websocketServer.clients.forEach(function each(client) {
    if (client.readyState === 1) {
      client.send(data)
    }
})
}


let lastuserid = 0;
let lastmsgid = 0

initusers()

fastify.get('/', { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
  connection.socket.on('message', message => {
    //  message.toString() === 'hi from client'
 
    const data = strObj(message.toString())
    switch (data.type) {
      case "connection":
        connection.socket.send(objStr({type:"connection",id:lastuserid+1}))
        lastuserid++;
        
        break
      case "login":
        if (getuser(data.username,data.password)){
          sendall(objStr({
            type:"message",
            msgid:lastmsgid,
            message:`${data.username} Joined The Server`,
            senderusername:"Server",
            senttime:Date.now(),
            groupid:"0000",
          }))
          connection.socket.send(objStr({type:"login",return:true}))
        }
        break
      case "register":
        if(getuser(data.username,data.password)){return}
        newuser(data.username,data.password)
        sendall(objStr({
          type:"message",
          msgid:lastmsgid,
          message:`${data.username} Joined The Server`,
          senderusername:"Server",
          senttime:Date.now(),
          groupid:"0000",
      }))

      connection.socket.send(objStr({type:"login",return:true}))
      case "message":
        lastmsgid++;
        sendall(objStr(
          {
            type:"message",
            msgid:lastmsgid,
            message:data.message,
            senderusername:data.username,
            senttime:data.senttime,
            groupid:data.groupid,
        }
          ))
        break;
      case "changegroup":
        connection.socket.send(objStr({ 
          type:"changegroup",
          return:true,
          groupid:data.groupid,
        }))
        lastmsgid++;

        sendall(objStr({
            type:"message",
            msgid:lastmsgid,
            message:`${data.username} Joined The Chat`,
            senderusername:"Server",
            senttime:Date.now(),
            groupid:data.groupid,
        }))

        
        break
      default:
        break
    }
    
  })
  //connection.socket.on("connection",(event) => {
    //console.log(connection.socket)
  //})
})

console.log("Starting")
fastify.listen(8080, err => {
  if (err) {
    fastify.log.error(err)
    console.log(err)
    process.exit(1)
  }
})