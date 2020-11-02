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
        User.findById(user, {"Productos":1 ,"_id":0},async function  (err, productArr) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

            var product=[]

            const pubs=productArr.Productos

            for(var i=0;i<pubs.length;i++){

                await Producto.findById(pubs[i],function (err,productos){
                    if (err)
                        // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                        return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

                    // También podemos devolver así la información:
                    product.push(productos)
                }).populate('user')
            }

            res.status(200).json({ status: "ok", data: product});

        })
    }

}

ControllerProducto.crear = async (req,res)=>{
    const user=req.decoded.sub

    var { images, especificaciones, precio, categoria, nombre} =req.body //atributos

    especificaciones=especificaciones.toLowerCase()
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
                especificaciones,
                precio,
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

    Producto.findById(req.params.id, function (err, products) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el anuncio con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
            if(products.user == user) {

                Producto.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err) {
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

    Producto.findById(req.params.id, function (err, products) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el anuncio con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
            if(products.user == user) {

                Producto.findByIdAndRemove(req.params.id, function(err, data) {
                    if (err || !data) {
                        //res.send(err);
                        // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                        res.status(404).json({ status: "error", data: "No se ha encontrado el anuncio con id: "+req.params.id});
                    }
                    else
                    {
                        res.status(200).json({ status: "ok", data: "Se ha eliminado correctamente el anuncio con id: "+req.params.id});

                    }
                });

            }else{
                res.status(404).json({ status: "error", data: "El id no corresponde a tu peticion: "});
            }

        }
    })

}
module.exports=ControllerProducto