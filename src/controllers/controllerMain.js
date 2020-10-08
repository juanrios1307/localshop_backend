const ControllerMain={}
const User=require('../models/User')
const Producto = require("../models/Producto");


ControllerMain.obtenerCategorias = (req, res) =>{

    if(req.headers['categoria']){
        const categoria=req.headers['categoria']
        console.log(categoria)


        Producto.find({categoria: categoria}, {"categoria": 1}, function (err, products) {
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
    Producto.find({}, function (err, productos) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        // También podemos devolver así la información:
        res.status(200).json({ status: "ok", data: productos });
    })
}

module.exports=ControllerMain