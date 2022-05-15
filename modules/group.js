
let groups = []


exports.createGroupById = (id) => {
    groups.push({id:id,members:[]})
    return {id:id,members:[]}
}
  
exports.getGroupById = (id) => {
  let ret;
  groups.forEach(group => {

    if (group.id == id){
        ret = group;
    }
  })
  if (ret == undefined){
    ret = exports.createGroupById(id)
  }
  return ret
}


  