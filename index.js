const {objStr,strObj,eventTypes} = require('./modules/utils')
const {getuser,initusers, newuser} = require('./modules/user')
const config = require("./config.json")
const { messages } = require('./modules/servermessages')
const fastify = require('fastify')()
fastify.register(require('fastify-websocket'))

const sendall = (data) => {
  fastify.websocketServer.clients.forEach(function each(client) {
    if (client.readyState === 1) {
      client.send(objStr(data))
    }
})
}


let lastuserid = 0;
let lastmsgid = 0

initusers()

fastify.get('/', { websocket: true },async(connection /* SocketStream */, req /* FastifyRequest */) => {
  connection.socket.on('message', async(message) => {
    //  message.toString() === 'hi from client'
 
    const data = strObj(message.toString())
    switch (data.type) {
      case eventTypes.CONNECTION:
        connection.socket.send(objStr({type:eventTypes.CONNECTION,id:lastuserid+1}))
        lastuserid++;
        
        break
      case eventTypes.LOGIN:
        const user = await getuser(data.username,data.password)
        if (user){
          lastmsgid++;
          connection.socket.send(objStr({type:eventTypes.LOGIN,return:true}))
          lastmsgid++;
          messages.join(fastify.websocketServer,data.username,lastmsgid)
        }else {
          connection.socket.send(objStr({type:eventTypes.LOGIN,return:false}))
        }
        break
      case eventTypes.REGISTER:
        if (newuser(data.username,data.password)){
          lastmsgid++;
          connection.socket.send(objStr({type:eventTypes.LOGIN,return:true}))
          lastmsgid++;
          messages.join(fastify.websocketServer,data.username,lastmsgid)        
        }
        else{
          connection.socket.send(objStr({type:eventTypes.LOGIN,return:false}))
        }
      case eventTypes.MESSAGE:
        lastmsgid++;
        sendall(
          {
            type:eventTypes.MESSAGE,
            msgid:lastmsgid,
            message:data.message,
            senderusername:data.username,
            senttime:data.senttime,
            groupid:data.groupid,
        }
          )
        break;
      case eventTypes.CHANGEGROUP:
        connection.socket.send(objStr({ 
          type:eventTypes.CHANGEGROUP,
          return:true,
          groupid:data.groupid,
        }))
        lastmsgid++;

        sendall({
            type:eventTypes.MESSAGE,
            msgid:lastmsgid,
            message:`${data.username} Joined The Chat`,
            senderusername:"Server",
            senttime:Date.now(),
            groupid:data.groupid,
        })

        
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
console.log(`Hosting On ${config.host}:${config.port}`)
fastify.listen(config.port,config.host, err => {
  if (err) {
    fastify.log.error(err)
    console.log(err)
    process.exit(1)
  }
})