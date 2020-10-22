const ControllerRate={}
const Producto=require('../models/Producto')

ControllerRate.obtener = (req,res)=>{
    const id=req.params.id

    Producto.findById(id, {"Comments":1 ,"_id":0},async function  (err, comments) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));


        const pubs=comments.Comments

        res.status(200).json({ status: "ok", data: pubs});

    })
}

ControllerRate.crear = async (req,res)=>{
    const user=req.decoded.sub
    const producto=req.params.id

    //Se reciben los datos a enviar
    const {comment,rating} =req.body //atributos

    const Comment={user,comment,rating};

    User.findById(user,function (err,user){
        if(err || !user){
            res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
        }else{
            Producto.findByIdAndUpdate(producto,  {  $push : { Comments :Comment}}, function (err) {
                if (err) {
                    // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                    res.status(404).json({ status: "error", data: "No se ha encontrado el producto con id: "+producto});
                } else {
                    // Devolvemos el código HTTP 200.
                    res.status(200).json({ status: "ok", data: "Comentario guardado in producto" });

                }
            });
        }
    });


}

module.exports=ControllerRate