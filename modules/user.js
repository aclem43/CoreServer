const fs = require('fs');
const { strObj, objStr } = require('./utils');
const config = require("../config.json");
const { MongoClient } = require('mongodb');
let file = null;
let users = null;

let init = false;

const uri = config.mongouri
const client = new MongoClient(uri)


const save = () => {
    fs.writeFileSync("./data/users.json",objStr(users))
}

exports.initusers = () => {
    client.connect();
    const database = client.db(config.mongoconfig.database);
    users = database.collection("user")

    init = true;
}


exports.newuser = async(username,password) => {
    if (!init) return
    const validity  = await checkUsername(username)
    if (validity){
        return false
    }
    else{
        const result = users.insertOne({username:username,password:password})
    }
    return true
}

const checkUsername = async (username) => {
    if (!init) return

    let returndata = false;

    const query = { username: username };
    const user = await users.findOne(query);

    if (user.username == username ) {
        returndata = true
    }
    if (!returndata){
        if (username in config.unavalibleusernames){
            returndata = true;
        }
    }
    return returndata
}

exports.getuser = async(usrnm,password) => {
    if (!init) return
    let returndata = false;

    const query = { username: usrnm };
    const userdata = await users.findOne(query).catch((reason)=> console.log(reason));
    if (userdata == null) returndata = false;
    else if (userdata.username == usrnm && userdata.password == password) {
        returndata = true
    }
    
    return returndata
    
}