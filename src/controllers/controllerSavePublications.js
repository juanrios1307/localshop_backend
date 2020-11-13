const ControllerSave={}
const User=require('../models/User')
const Product =require('../models/Producto')

ControllerSave.obtener=(req,res)=>{
    const id=req.decoded.sub

    User.findById(id, {"Save":1 ,"_id":0},async function  (err, saves) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        var productos=[]
        var cantidades=[]


        const pubs=saves.Save

        for(var i=0;i<pubs.length;i++){

            await Product.findById(pubs[i].producto,function (err,producto){
                if (err)
                    // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                    return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

                // También podemos devolver así la información:
                productos.push(producto)
            }).populate('user')

            cantidades.push(pubs[i].cantidad)

        }


        res.status(200).json({ status: "ok", data: productos,cantidades: cantidades});

    })
}

ControllerSave.crear=(req,res)=>{

    const id=req.decoded.sub
    const {Save,cantidad}=req.body

    User.findById(id, {"Save":1 ,"_id":0},async function  (err, saves) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));



        const pubs=saves.Save
        var bool=false

        for(var i=0;i<pubs.length;i++){
            if(pubs[i].producto == Save){
                bool=true
            }
        }
        if(bool==false) {
            Product.findById(Save, function (err, producto) {
                if (err || !producto) {
                    res.status(404).json({status: "error", data: "No se ha encontrado el producto con id: " + Save});
                } else {
                    User.findByIdAndUpdate(id, {$push: {Save: {producto,cantidad}}}, function (err) {
                        if (err) {
                            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                            res.status(404).json({
                                status: "error",
                                data: "No se ha encontrado el usuario con id: " + id
                            });
                        } else {
                            // Devolvemos el código HTTP 200.
                            res.status(200).json({status: "ok", data: "Producto guardado en tu carrito de compras"});

                        }
                    });
                }
            });
        }else{
            res.status(200).json({ status: "ok", data: "El producto ya está en tu carrito de compras"});
        }


    })



}

ControllerSave.eliminar=(req, res)=>{

    const user=req.decoded.sub
    const producto=req.params.id

    User.update({_id:user},  {  $pull : { "Save" : { "producto":producto} }}, function (err) {
        if (err) {
            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
            res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
        } else {
            // Devolvemos el código HTTP 200.
            res.status(200).json({ status: "ok", data: "Producto eliminado de tu carrito de compras" });

        }
    });

}

ControllerSave.actualizar = (req,res) =>{
    const user=req.decoded.sub
    const producto=req.params.id
    const cantidad=req.headers['cantidad']

    Product.findById(producto,function (err,product){
        if (err) {
            //res.send(err);
            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
            res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
        } else {
            // Devolvemos el código HTTP 200.
           if(product.stock < cantidad){
               res.status(203).json({ status: "ok", data: "La cantidad que deseas guardar no esta disponible" });
           }else{
               User.update({_id: user , "Save.producto":producto},{$set : {"Save.$.cantidad": cantidad }}, function (err) {
                   if (err) {
                       //res.send(err);
                       // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                       res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
                   } else {
                       // Devolvemos el código HTTP 200.
                       res.status(200).json({ status: "ok", data: "cantidad actualizada" });
                   }
               });
           }
        }
    })

}

module.exports=ControllerSave