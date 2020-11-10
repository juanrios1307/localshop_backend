const ControllerMain={}
const User=require('../models/User')
const Producto = require("../models/Producto");


ControllerMain.obtenerCategorias = (req, res) =>{

    if(req.headers['categoria']){
        const categoria=req.headers['categoria']
        console.log(categoria)


        Producto.find({ categoria : {$regex : "^"+categoria } }, function (err, products) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(422).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));

            // También podemos devolver así la información:
            res.status(200).json({
                status: "ok",
                data: products
            });
        });
    }else {

        console.log("No")
        // Se buscan todas las profesiones
        Producto.find({}, {"categoria": 1, "_id": 0}, function (err, products) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(422).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));

            // También podemos devolver así la información:
            res.status(200).json({
                status: "ok",
                data: products
            });
        });
    }
}

ControllerMain.obtenerSellers =(req, res)=>{
    // se buscan todos los Workers
    User.find({isSeller:true}, function (err, sellers) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        // También podemos devolver así la información:
        res.status(200).json({ status: "ok", data: sellers });
    }).populate('user');
}

ControllerMain.obtenerProductos =(req, res)=>{
    const producto=req.headers['producto']
    const id=req.headers['id']

    const promedio=req.headers['promedio']
    const date=req.headers['date']
    const precio=req.headers['precio']

    if(producto && producto!="null"){
        const producto=req.headers['producto']


        Producto.find({ nombre : {$regex : "^"+producto } }, function (err, products) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

            // También podemos devolver así la información:
            res.status(200).json({ status: "ok", data: products });
        }).populate('user').sort({"promedio": (promedio == "true" ? -1 : 1)}).sort({"date": (date == "true" ? 1 : -1)}).sort({"precio": (precio == "true" ? -1 : 1)});

    }else {
        if(id && id!="null"){
            //si se envia la peticion con parametros
            Producto.findById(id, function (err, producto) {
                if (err) {
                    // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                    res.status(404).json({ status: "error", data: "No se ha encontrado el producto con id: "+id});
                } else {
                    res.status(200).json({ status: "ok", data: producto });

                }
            }).populate('user')

        }else {
            // se buscan todos los Workers
            Producto.find({}, function (err, productos) {
                if (err)
                    // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                    return (res.type('json').status(422).send({
                        status: "error",
                        data: "No se puede procesar la entidad, datos incorrectos!"
                    }));

                // También podemos devolver así la información:
                res.status(200).json({status: "ok", data: productos});
            }).populate('user').sort({"promedio": (promedio == "true" ? -1 : 1)}).sort({"date": (date == "true" ? 1 : -1)}).sort({"precio": (precio == "true" ? -1 : 1)});
        }
    }
}

ControllerMain.obtenerPromotedProducts =(req, res)=>{

    // se buscan 3 de los Workers prom
    Producto.find({}, function (err, workers) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        // También podemos devolver así la información:
        res.status(200).json({ status: "ok", data: workers });
    }).populate('user').sort({"promedio":-1}).limit(3);
}

module.exports=ControllerMain