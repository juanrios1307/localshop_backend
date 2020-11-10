const ControllerContact={}
const User=require('../models/User')
const Producto=require('../models/Producto')
const nodemailer = require("nodemailer");


ControllerContact.crear= async (req,res)=>{

    //Se recibe el id del trabajador buscado
    const seller=req.params.id
    const user=req.decoded.sub

    //Se reciben los datos a enviar
    const {mensaje,asunto} =req.body //atributos

    Producto.findById(seller, function (err, seller) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el producto con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
            var transporter = nodemailer.createTransport({
                service: 'Outlook365',
                auth: {
                    user: 'localshop20202@outlook.com',
                    pass: '2Juan1Santiago'
                }
            });


            var mailOptions = {
                from: 'localshop20202@outlook.com',
                to: seller.user.correo,
                subject: asunto,
                text: mensaje
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("e: "+error)
                    res.status(203).json({status: "error", data: error});
                } else {
                    res.status(200).json({status: "ok", data: "Formulario enviado"});
                }
            });

        }
    }).populate('user')



}

//Se exporta el controlador
module.exports=ControllerContact