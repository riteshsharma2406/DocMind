const jwt = require('jsonwebtoken');
const {findUsername, findUser, saveUser} = require('../repository/userRepository.js');

async function signup(req, res){
    try{
        const {username, password} = req.body;

        if(!username || !password)
        {
            return res.status(400).json({message: "All fields are required"});
        }

        const existingUser = findUsername(username);

        if(existingUser)
        {
            return res.status(400).json({message: "User already exists"});
        }

        const newUser = {
            userId: Date.now().toString(),
            username,
            password
        }

        saveUser(newUser);

        res.status(200).json({message: "Signup successful"})

    }catch(e)
    {
        console.log(e);
        res.status(500).json({message: "Signup error"})
    }
}

async function login(req,res)
{
    try{
        const {username, password} = req.body;

        const user = findUser(username, password);

        if(!user)
        {
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const token = jwt.sign(
            {
                userId: user.userId,
                username: user.username
            },
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        )

        res.status(200).json({
            message: "Login successful",
            token
        })
    }catch(e)
    {
        console.log(e)
        res.status(500).json({message: "Login Error"})
    }
}

module.exports = {signup, login};