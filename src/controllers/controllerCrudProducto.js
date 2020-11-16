const ControllerProducto={}
const Producto=require('../models/Producto')
const User=require('../models/User')

ControllerProducto.obtener = (req,res)=>{
    const user=req.decoded.sub

    if(req.params.id) {
        Producto.findById(req.params.id, function (err, producto) {
            if (err) {
                // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                res.status(404).json({
                    status: "error",
                    data: "No se ha encontrado el anuncio con id: " + req.params.id
                });
            } else {
                // También podemos devolver así la información:
                if (producto.user == user) {

                    // También podemos devolver así la información:
                    res.status(200).json({status: "ok", data: producto});

                } else {
                    res.status(404).json({status: "error", data: "El id no corresponde a tu peticion: "});
                }

            }
        })
    }else{
        Producto.find({"user":user},function(err,product){
            if(err){
                res.status(203).json({
                    status: "error",
                    data: "No se ha encontrado el anuncio con id: " + req.params.id
                });

            }else{

                res.status(200).json({ status: "ok", data: product});
            }
        }).populate('user')

    }

}

ControllerProducto.crear = async (req,res)=>{
    const user=req.decoded.sub

    var { images, descripcion, precio,stock, categoria, nombre} =req.body //atributos

    descripcion=descripcion.toLowerCase()
    categoria=categoria.toLowerCase()
    nombre=nombre.toLowerCase()

    User.findByIdAndUpdate(user, { isSeller: true },async function (err) {
        if (err) {
            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
        }
        else {

            const registro=new Producto({
                user,
                images,
                descripcion,
                precio,
                stock,
                categoria,
                nombre,
                promedio:"0",
                Comments:[]
            })

            await  registro.save()

            User.findByIdAndUpdate(user,  {  $push : { Productos : registro.id }}, function (err) {
                if (err) {
                    // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                    res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
                } else {
                    // Devolvemos el código HTTP 200.
                    res.status(200).json({ status: "ok", data: "Producto guardado" });

                }
            });

        }
    });


}

ControllerProducto.actualizar=(req, res)=>{

    const user=req.decoded.sub
    const producto=req.params.id


    Producto.findById(producto, function (err, products) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el anuncio con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
            if(products.user == user) {

                Producto.findByIdAndUpdate(producto, { $set: req.body }, function (err) {
                    if (err) {
                        //res.send(err);
                        // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                        res.status(404).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
                    } else {
                        // Devolvemos el código HTTP 200.
                        res.status(200).json({ status: "ok", data: "anuncio actualizado" });
                    }
                });
            }else{
                res.status(404).json({ status: "error", data: "El id no corresponde a tu peticion: "});
            }

        }
    })

}

ControllerProducto.eliminar=(req, res)=>{

    const user=req.decoded.sub
    const producto=req.params.id

    Producto.findById(producto, function (err, products) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el anuncio con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
            if(products.user == user) {

                Producto.findByIdAndRemove(producto, function(err, data) {
                    if (err || !data) {
                        //res.send(err);
                        // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                        res.status(404).json({ status: "error", data: "No se ha encontrado el anuncio con id: "+req.params.id});
                    }
                    else
                    {
                        User.findByIdAndUpdate(user,  {  $pull : { Productos : producto }}, function (err) {
                            if (err) {
                                // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
                            } else {

                                User.update({"Save.producto":producto},{$pull : {"Save":{ "producto":producto}}},{multi:true},function(err){
                                    if(err){
                                        res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
                                    } else {
                                        // Devolvemos el código HTTP 200.
                                        res.status(200).json({ status: "ok", data: "Producto eliminado satisfactoriamente" });

                                    }
                                })

                            }
                        });


                    }
                });

            }else{
                res.status(404).json({ status: "error", data: "El id no corresponde a tu peticion: "});
            }

        }
    })

}
module.exports=ControllerProducto