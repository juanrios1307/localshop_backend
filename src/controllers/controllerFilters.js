const ControllerFilters={}
const User=require('../models/User')
const Product=require('../models/Producto')

ControllerFilters.obtenerCategoria = (req, res) =>{

    const categoria= req.body

    // Se buscan todas las profesiones
    Product.find({"categoria":categoria }, function (err, productos) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        // También podemos devolver así la información:
        res.status(200).json({
            status: "ok",
            data: productos
        });
    });
}

ControllerFilters.obtenerNombre= (req, res) =>{

    const nombre= req.body

    // Se buscan todas las profesiones
    Product.find({"nombre" : nombre }, function (err, productos) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        // También podemos devolver así la información:
        res.status(200).json({
            status: "ok",
            data: productos
        });
    });
}

ControllerFilters.obtenerTitulo= (req,res) =>{

    const need= req.body

    // Se buscan todas las profesiones
    Product.find({"titulo":{$exists: need} }, function (err, workers) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        // También podemos devolver así la información:
        res.status(200).json({
            status: "ok",
            data: workers
        });
    });
}

//Se exporta controlador
module.exports=ControllerFilters