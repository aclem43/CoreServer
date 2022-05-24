const {objStr,strObj,eventTypes} = require('./utils')


const sendall = (websocketServer,data) => {

    websocketServer.clients.forEach(function each(client) {
      if (client.readyState === 1) {
        client.send(objStr(data))
      }
  })
}
exports.messages = {
    join : (websockets,username,msgid) => {
        sendall(websockets,{
            type:eventTypes.MESSAGE,
            msgid:msgid,
            message:`${username} Joined The Server`,
            senderusername:"Server",
            senttime:Date.now(),
            groupid:"0000",
          })
    }
    
}
