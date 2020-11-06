const ControllerFilters={}
const User=require('../models/User')
const Product=require('../models/Producto')

ControllerFilters.obtenerCiudad= (req, res) =>{
    const producto=req.headers['producto']
    const ciudad=req.headers['ciudad']

    if(producto != undefined && ciudad != undefined){
        // Se buscan todas las profesiones
        Product.find({ nombre : {$regex : "^"+producto }}, function (err, producto) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));
            else {

                var cities=[]

                for(var i=0;i<producto.length;i++){
                    if(producto[i].user.ciudad==ciudad){
                        cities.push(producto[i])
                    }
                }

                res.status(200).json({
                    status: "ok",
                    data: cities
                });
            }
        }).populate('user')

    }else{

        User.distinct("ciudad",function (err,ciudad) {
            if(err){
                console.log(err)

                res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" });
            } else{
                res.status(200).json({data:ciudad})
            }
        })


    }

}

ControllerFilters.obtenerPrecio= (req, res) =>{
    const producto=req.headers['producto']
    const isMayor=req.headers['ismayor']


    Product.find({ nombre : {$regex : "^"+producto } }, function (err, productos) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        // También podemos devolver así la información:
        res.status(200).json({ status: "ok", data: productos });

    }).populate('user').sort({"precio":(isMayor=="true"?-1:1)});

}

ControllerFilters.obtenerCategoria = (req, res) =>{
    const producto=req.headers['producto']
    const categoria=req.headers['categoria']

    if(producto != undefined && categoria != undefined){
        // Se buscan todas las profesiones

        Product.find({$and: [{ nombre : {$regex : "^"+producto }}, {"categoria": categoria}]}, function (err, productos) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));
            else {

                res.status(200).json({
                    status: "ok",
                    data: productos
                });
            }
        }).populate('user')

    }else{

        Product.distinct("categoria",function (err,categorias) {
            if(err){
                res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" });
            } else{
                console.log(categorias)
                res.status(200).json({data:categorias})
            }
        })


    }

}


ControllerFilters.obtenerPromedio= (req,res) => {
    const producto=req.headers['producto']
    const isMayor=req.headers['ismayor']


    Product.find({ nombre : {$regex : "^"+producto } }, function (err, productos) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        // También podemos devolver así la información:
        res.status(200).json({ status: "ok", data: productos });

    }).populate('user').sort({"promedio":(isMayor=="true"?-1:1)});

}

ControllerFilters.obtenerFecha= (req, res) =>{
    const producto=req.headers['producto']
    const isMayor=req.headers['ismayor']


    Product.find({ nombre : {$regex : "^"+producto } }, function (err, productos) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        // También podemos devolver así la información:
        res.status(200).json({ status: "ok", data: productos });

    }).populate('user').sort({"date":(isMayor=="true"?1:-1)});

}

//Se exporta controlador
module.exports=ControllerFilters