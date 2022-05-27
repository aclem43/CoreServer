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


exports.addUser = (groupid,username,id) =>{
  this.getGroupById(groupid)
  groups.forEach(group => {
    if (group.id == groupid){
        group.members.push({id:id,user:username})
    }
  })
}

exports.removeUser = (groupid,username,id) => {
  groups.forEach(group => {
    if (group.id == groupid){
      group.members.forEach((member,index)=> {
        if (member.id == id){
          group.members.splice(index, 1);
        }
      })
    }
  })
}

exports.removeUserById = (id) => {
  groups.forEach((group)=>{
    group.members.forEach((member,index)=>{
       if (member.id == id) {
        group.members.splice(index, 1);
       }
    })
  })
}

exports.updateGroups = () => {
  return {type:"group",groups:groups}
}
  

exports.changeGroup = (curentGroup,newGroup,username,id) => {
  this.removeUser(curentGroup,username,id)
  this.getGroupById(newGroup)
  this.addUser(newGroup,username,id)
}