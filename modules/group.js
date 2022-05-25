let groups = null;
let sendfunction = null


exports.initGroups = (sendall) => {
  groups = []
  sendfunction = sendall
}



const createGroupById = (id) => {
    groups.push({id:id,members:[]})
}
  
exports.getGroupById = (id) => {
  let ret = null;
  groups.forEach(group => {

    if (group.id == id){
        ret = group;
    }
  })
  if (ret == undefined){
    ret = createGroupById(id)
  }
  return ret
}


exports.addUser = (groupid,username) =>{
  this.getGroupById(groupid)
  groups.forEach(group => {
    if (group.id == groupid){
        group.members.push(username)
    }
  })
}

const removeUser = (groupid,username) => {
  groups.forEach(group => {
    if (group.id == groupid){
      
      const index = group.members.indexOf(username);
      if (index > -1) {
        group.members.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
  })
}

exports.updateGroups = () => {
  return {type:"group",groups:groups}
}
  

exports.changeGroup = (curentGroup,newGroup,username) => {
  removeUser(curentGroup,username)
  this.getGroupById(newGroup)
  this.addUser(newGroup,username)
}