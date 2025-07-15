const { get } = require('../app');
const {user} = require('../models');

//create user 
async function createUser(req,res){
    try{
        const {name,email} = req.body;

        if (!name){
            return res.status(400).json({
                message: "Name is required."
            });
        }
        if (!email){
            return res.status(400).json({
                message: "Email is required."
            });
        }

        const exist_mail_usr = await user.findOne({where:{email:email}});

        if (exist_mail_usr){
            return res.status(400).json({
                message: "Email already registered."
            });
        }

        const User = await user.create({name,email});
        return res.status(201).json({
            message: `User created successfully with id ${User.id}`
        });
    }catch(err){
        res.status(500).json({
            message: 'Internal server error. Please try again later.',
            error: err.message
        });   
    }
};

//fetch user details
async function getUser(req,res){
    try{
        const User = await user.findByPk(req.params.id);
        if(!User){
            return res.status(400).json({
                message: "User not found."
            });
        }

        return res.json(User);
    }
    catch{
        res.status(500).json({
            message: 'Internal server error. Please try again later.',
            error: err.message
        });   
    }
};

//fetch all users
async function  getAllUser(req,res) {
    try{
        const User = await user.findAll();
        if(!User){
            return res.status(400).json({
                message: "User not found."
            });
        }

        return res.json(User);
    }catch(err){
        res.status(500).json({
            message: 'Internal server error. Please try again later.',
            error: err.message
        });   
    }
}

module.exports = {
    createUser,
    getUser,
    getAllUser
};
