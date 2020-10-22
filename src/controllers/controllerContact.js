const ControllerContact={}
const Message=require('../models/ContactMessage')
const User=require('../models/User')



ControllerContact.crear= async (req,res)=>{

    //Se recibe el id del trabajador buscado
    const seller=req.params.id
    const user=req.decoded.sub

    //Se reciben los datos a enviar
    const {mensaje,asunto} =req.body //atributos

    User.findById(seller, function (err, seller) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'quickservices20202@gmail.com',
                    pass: '2juan1santiago'
                }
            });


            var mailOptions = {
                from: 'quickservices20202@gmail.com',
                to: seller.correo,
                subject: asunto,
                text: mensaje
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.status(404).json({status: "error", data: error});
                } else {
                    res.status(200).json({status: "ok", data: "Formulario enviado"});
                }
            });

        }
    }).populate('user')



}

//Se exporta el controlador
module.exports=ControllerContact