const fs = require('fs');
const { strObj, objStr } = require('./utils');
const config = require("../config.json")
let file = null;
let users = null;

const checkfile = () => {
    try {
        if (fs.existsSync("./data/users.json",'{"users":[]}')) {
            let data = fs.readFileSync("./data/users.json").toString()
            users = strObj(data)
            console.log(users)
        }else {
            fs.writeFileSync("./data/users.json",'{"users":[]}')
            let data = fs.readFileSync("./data/users.json").toString()
            users = strObj(data)
            console.log(users)
        }
    } catch(err) {
        console.error(err)
    }
}

const save = () => {
    fs.writeFileSync("./data/users.json",objStr(users))
}

exports.initusers = () => checkfile()

exports.newuser = (username,password) => {
    if (checkUsername(username)){
        return false
    }
    else{
        users.users.push({username:username,password:password})
        save()
    }
    return true
}

const checkUsername = (username) => {
    let returndata = false;
    users.users.forEach((user)=>{
        if (user.username == username) {
            returndata = true
        }
    })
    if (!returndata){
        if (username in config.unavalibleusernames){
            returndata = true;
        }
    }
    return returndata
}

exports.getuser = (username,password) => {
    let returndata = false;
    users.users.forEach(element => {
        if (element.username == username && element.password == password) {
            returndata = true
        }
    });
    
    return returndata
    
}