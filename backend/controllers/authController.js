const jwt = require('jsonwebtoken');
const {findUsername, findUser, saveUser} = require('../repository/userRepository.js');
const User = require('../models/user.js')
const bcrypt = require('bcrypt');

async function signup(req, res){
    try{
        const {username, password} = req.body;

        if(!username || !password)
        {
            return res.status(400).json({message: "All fields are required"});
        }

        // const existingUser = findUsername(username);
        const existingUser = await User.findOne({username});

        if(existingUser)
        {
            return res.status(400).json({message: "User already exists"});
        }

        // const newUser = {
        //     userId: Date.now().toString(),
        //     username,
        //     password
        // }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            password: hashedPassword
        });



        // saveUser(newUser);

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

        // const user = findUser(username, password);

        const user = await User.findOne({username})

        if(!user)
        {
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch)
        {
            return res.status(400).json({
                message: "Invalid Credentials"
            })
        }

        const token = jwt.sign(
            {
                userId: user._id,
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