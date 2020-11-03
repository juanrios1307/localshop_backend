const ControllerLogin={}

const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User=require('../models/User');

ControllerLogin.authenticate= async (req,res)=> {
    const {correo, pwd} =req.body

    const user = await User.findOne({correo});

    if (user && bcrypt.compareSync(pwd, user.pwd)) {
        const token = jwt.sign({sub: user.id}, config.secret,
            {expiresIn: 86400});

        res.status(200).json({
            token:token ,
            mensaje:"Sesion Iniciada"
        });

    }else {
        res.status(203).json({ mensaje: "Usuario o contraseña incorrectos"})
    }
}

module.exports=ControllerLogin