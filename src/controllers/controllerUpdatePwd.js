const ControllerUpdatePwd={}

const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User=require('../models/User');
const nodemailer = require("nodemailer");

ControllerUpdatePwd.send= (req,res)=> {

    const correo=req.body.correo

   User.findOne({"correo":correo }, function (err, user) {
       if(err || user==null){
           return (res.type('json').status(203).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

       }else{
           var transporter = nodemailer.createTransport({
               service: 'Outlook365',
               auth: {
                   user: 'localshop20202@outlook.com',
                   pass: '2Juan1Santiago'
               }
           });

           var mailOptions = {
               from: 'localshop20202@outlook.com',
               to: user.correo,
               subject: "Restablecer contraseña Localshop",
               html:"<p>Hola, en el siguiente link puedes restablecer tu contraseña</p>" +
                   "<a href='http://localhost:3000/updatepwd'>Restablecer Contraseña</a>"
              // html:"<a href='https://glacial-everglades-42121.herokuapp.com/updatepwd'>Restablecer Contraseña</a>"
           };

           transporter.sendMail(mailOptions, function(error, info){
               if (error) {
                   res.status(203).json({ status: "error", data: error});
               } else {
                   res.status(200).json({ status: "ok", data: "Formulario enviado, puede revisar su correo"});
               }
           });
       }

   }
   )
}

ControllerUpdatePwd.actualizar=(req,res)=>{

    const correo=req.body.correo
    var pwd=req.body.pwd

    if (pwd) {
        pwd= bcrypt.hashSync(pwd, 10);
    }

    User.findOne({"correo":correo }, function (err, user) {
        if(err || user==null){
            return (res.type('json').status(203).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        }else {
            User.findByIdAndUpdate(user.id, { $set:{"pwd":pwd} }, function (err,us) {
                if (err) {
                    // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                    res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
                } else {
                    // Devolvemos el código HTTP 200.
                    res.status(200).json({ status: "ok", data: "Contraseña Actualizada, puede iniciar sesión" });
                }
            });
        }

    }
    )


}



module.exports=ControllerUpdatePwd