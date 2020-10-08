const ControllerRate={}
const Comment=require('../models/Comment')

ControllerRate.obtener = (req,res)=>{
    Comment.find({}, function (err, comments) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        // También podemos devolver así la información:
        res.status(200).json({ status: "ok", data: comments });
    })
}

ControllerRate.crear = async (req,res)=>{
    const user=req.decoded.sub
    const producto=req.params.id

    //Se reciben los datos a enviar
    const {comment,rating} =req.body //atributos


    //se registran los datos en el modelo y se suben a la DB
    const registro=new Comment({
        user,
        producto,
        comment,
        rating
    })
    await  registro.save()

    //Se genera respuesta de exito
    res.json({
        mensaje:"Registro guardado"
    })

}

module.exports=ControllerRate