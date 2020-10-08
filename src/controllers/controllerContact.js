const ControllerContact={}
const Message=require('../models/ContactMessage')
const User=require('../models/User')

ControllerContact.obtener= async (req,res) =>{

    const user=req.decoded.sub

   await Message.find({user}, function (err, messages) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
                res.status(200).json({ status: "ok", data: messages });
        }
    });

}

ControllerContact.crear= async (req,res)=>{

    //Se recibe el id del trabajador buscado
    const seller=req.params.id
    const user=req.decoded

    //Se reciben los datos a enviar
    const mensaje =req.body.mensaje //atributos

    //se registran los datos en el modelo y se suben a la DB
    const registro=new Message({
        mensaje,
        seller,
        user:user.sub
    })
    await  registro.save()

    //Se genera respuesta de exito
    res.json({
        mensaje:"Registro guardado"
    })
}

//Se exporta el controlador
module.exports=ControllerContact