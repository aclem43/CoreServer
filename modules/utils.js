exports.objStr = (object) => {
    return JSON.stringify(object)
}
  
exports.strObj = (string) => {
    return JSON.parse(string)
}

exports.eventTypes = {
  CONNECTION: "connection",
  LOGIN: "login",
  REGISTER: "register",
  MESSAGE: "message",
  CHANGEGROUP: "changegroup"

}
