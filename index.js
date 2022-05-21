const {objStr,strObj} = require('./modules/utils')
const {getuser,initusers, newuser} = require('./modules/user')
const config = require("./config.json")
const fastify = require('fastify')()
fastify.register(require('fastify-websocket'))

const sendall = (data) => {
  fastify.websocketServer.clients.forEach(function each(client) {
    if (client.readyState === 1) {
      client.send(data)
    }
})
}


const eventTypes = {
  CONNECTION: "connection",
  LOGIN: "login",
  REGISTER: "register",
  MESSAGE: "message",
  CHANGEGROUP: "changegroup"

}


let lastuserid = 0;
let lastmsgid = 0

initusers()

fastify.get('/', { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
  connection.socket.on('message', message => {
    //  message.toString() === 'hi from client'
 
    const data = strObj(message.toString())
    switch (data.type) {
      case eventTypes.CONNECTION:
        connection.socket.send(objStr({type:eventTypes.CONNECTION,id:lastuserid+1}))
        lastuserid++;
        
        break
      case eventTypes.LOGIN:
        if (getuser(data.username,data.password)){
          sendall(objStr({
            type:eventTypes.MESSAGE,
            msgid:lastmsgid,
            message:`${data.username} Joined The Server`,
            senderusername:"Server",
            senttime:Date.now(),
            groupid:"0000",
          }))
          connection.socket.send(objStr({type:eventTypes.LOGIN,return:true}))
        }else {
          connection.socket.send(objStr({type:eventTypes.LOGIN,return:false}))
        }
        break
      case eventTypes.REGISTER:
        if(getuser(data.username,data.password)){
          connection.socket.send(objStr({type:eventTypes.LOGIN,return:false}))
          return
        }
        
        newuser(data.username,data.password)
        sendall(objStr({
          type:eventTypes.MESSAGE,
          msgid:lastmsgid,
          message:`${data.username} Joined The Server`,
          senderusername:"Server",
          senttime:Date.now(),
          groupid:"0000",
      }))

      connection.socket.send(objStr({type:eventTypes.LOGIN,return:true}))
      case eventTypes.MESSAGE:
        lastmsgid++;
        sendall(objStr(
          {
            type:eventTypes.MESSAGE,
            msgid:lastmsgid,
            message:data.message,
            senderusername:data.username,
            senttime:data.senttime,
            groupid:data.groupid,
        }
          ))
        break;
      case eventTypes.CHANGEGROUP:
        connection.socket.send(objStr({ 
          type:eventTypes.CHANGEGROUP,
          return:true,
          groupid:data.groupid,
        }))
        lastmsgid++;

        sendall(objStr({
            type:eventTypes.MESSAGE,
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


console.log("Version - " + config.version)
console.log("Starting on port " + config.port)
fastify.listen(config.port, err => {
  if (err) {
    fastify.log.error(err)
    console.log(err)
    process.exit(1)
  }
})