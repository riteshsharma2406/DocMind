const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname,'../data/user.json');

let users = [];

// if user.json exists load all user in user[]
if(fs.existsSync(DATA_PATH))
{
    users = JSON.parse(fs.readFileSync(DATA_PATH));
}

//find by userName
function findUsername(username)
{
    return users.find((user)=> user.username === username)
}

//find user for login
function findUser(username, password)
{
    return users.find((user)=> user.username === username && user.password === password);
}

//save user
function saveUser(user){
    users.push(user);
    fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2));
}

module.exports = {findUsername, findUser, saveUser};