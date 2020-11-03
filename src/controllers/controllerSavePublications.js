const ControllerSave={}
const User=require('../models/User')
const Product =require('../models/Producto')

ControllerSave.obtener=(req,res)=>{
    const id=req.decoded.sub

    User.findById(id, {"Save":1 ,"_id":0},async function  (err, saves) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        var workers=[]

        const pubs=saves.Save

        for(var i=0;i<pubs.length;i++){

            await Product.findById(pubs[i],function (err,worker){
                if (err)
                    // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                    return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

                // También podemos devolver así la información:
                workers.push(worker)
            }).populate('user')
        }


        res.status(200).json({ status: "ok", data: workers});

    })
}

ControllerSave.crear=(req,res)=>{

    const id=req.decoded.sub
    const {Save}=req.body


    Product.findById(Save,function (err, producto){
        if(err || !producto){
            res.status(404).json({ status: "error", data: "No se ha encontrado el producto con id: "+Save});
        }else{
            User.findByIdAndUpdate(id,  {  $push : { Save : producto }}, function (err) {
                if (err) {
                    // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                    res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+id});
                } else {
                    // Devolvemos el código HTTP 200.
                    res.status(200).json({ status: "ok", data: "Producto guardado en tu carrito de compras" });

                }
            });
        }
    });

}

ControllerSave.eliminar=(req, res)=>{

    const user=req.decoded.sub
    const producto=req.params.id

    User.findByIdAndUpdate(user,  {  $pull : { Save : producto }}, function (err) {
        if (err) {
            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
        } else {
            // Devolvemos el código HTTP 200.
            res.status(200).json({ status: "ok", data: "Producto eliminado de tu carrito de compras" });

        }
    });

}

module.exports=ControllerSave