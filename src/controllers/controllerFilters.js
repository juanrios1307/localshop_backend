const ControllerFilters={}
const User=require('../models/User')
const Product=require('../models/Producto')

ControllerFilters.obtenerCiudad= (req, res) =>{


        User.distinct("ciudad",function (err,ciudad) {
            if(err){
                console.log(err)

                res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" });
            } else{
                res.status(200).json({data:ciudad})
            }
        })

}

ControllerFilters.obtenerCategoria = (req, res) =>{

        Product.distinct("categoria",function (err,categorias) {
            if(err){
                res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" });
            } else{
                res.status(200).json({data:categorias})
            }
        })

}

ControllerFilters.obtenerPromedio= (req,res) => {
    const producto=req.headers['producto']


    const promedio=req.headers['promedio']
    const date=req.headers['fecha']
    const precio=req.headers['precio']

    const categoria=req.headers['categoria']
    const ciudad=req.headers['ciudad']

    if(categoria == '' && ciudad== ''){

        Product.find({ nombre : {$regex : "^"+producto } }, function (err, productos) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

            // También podemos devolver así la información:
            res.status(200).json({ status: "ok", data: productos });

        }).populate('user').sort({"promedio":(promedio=="true"?-1:1)}).sort({"date":(date=="true"?1:-1)}).sort({"precio": (precio == "true" ? -1 : 1)});


    } else if(categoria != '' && ciudad == '' ){

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
        }).populate('user').sort({"promedio": (promedio == "true" ? -1 : 1)}).sort({"date": (date == "true" ? 1 : -1)}).sort({"precio": (precio == "true" ? -1 : 1)});


    }else if (categoria == '' && ciudad != '' ){

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
        }).populate('user').sort({"promedio": (promedio == "true" ? -1 : 1)}).sort({"date": (date == "true" ? 1 : -1)}).sort({"precio": (precio == "true" ? -1 : 1)});


    }else{

        Product.find({$and: [{ nombre : {$regex : "^"+producto }}, {"categoria": categoria}]},  function (err, producto) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));
            else {

                var products=[]

                for(var i=0;i<producto.length;i++){
                    if(producto[i].user.ciudad==ciudad){
                        products.push(producto[i])
                    }
                }

                res.status(200).json({
                    status: "ok",
                    data: products
                });
            }
        }).populate('user').sort({"promedio": (promedio == "true" ? -1 : 1)}).sort({"date": (date == "true" ? 1 : -1)}).sort({"precio": (precio == "true" ? -1 : 1)});

    }
}

ControllerFilters.obtenerPrecio= (req, res) =>{
    const producto=req.headers['producto']

    const promedio=req.headers['promedio']
    const date=req.headers['fecha']
    const precio=req.headers['precio']

    const categoria=req.headers['categoria']
    const ciudad=req.headers['ciudad']

    if(categoria == '' && ciudad== ''){

        Product.find({ nombre : {$regex : "^"+producto } }, function (err, productos) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

            // También podemos devolver así la información:
            res.status(200).json({ status: "ok", data: productos });

        }).populate('user').sort({"precio": (precio == "true" ? -1 : 1)}).sort({"promedio":(promedio=="true"?-1:1)}).sort({"date":(date=="true"?1:-1)});


    } else if(categoria != '' && ciudad == '' ){

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
        }).populate('user').sort({"precio": (precio == "true" ? -1 : 1)}).sort({"promedio":(promedio=="true"?-1:1)}).sort({"date":(date=="true"?1:-1)});


    }else if (categoria == '' && ciudad != '' ){

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
        }).populate('user').sort({"precio": (precio == "true" ? -1 : 1)}).sort({"promedio":(promedio=="true"?-1:1)}).sort({"date":(date=="true"?1:-1)});


    }else{

        Product.find({$and: [{ nombre : {$regex : "^"+producto }}, {"categoria": categoria}]},  function (err, producto) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));
            else {

                var products=[]

                for(var i=0;i<producto.length;i++){
                    if(producto[i].user.ciudad==ciudad){
                        products.push(producto[i])
                    }
                }

                res.status(200).json({
                    status: "ok",
                    data: products
                });
            }
        }).populate('user').sort({"precio": (precio == "true" ? -1 : 1)}).sort({"promedio":(promedio=="true"?-1:1)}).sort({"date":(date=="true"?1:-1)});

    }
}

ControllerFilters.obtenerFecha= (req, res) =>{
    const producto=req.headers['producto']

    const promedio=req.headers['promedio']
    const date=req.headers['fecha']
    const precio=req.headers['precio']

    const categoria=req.headers['categoria']
    const ciudad=req.headers['ciudad']

    if(categoria == '' && ciudad== ''){

        Product.find({ nombre : {$regex : "^"+producto } }, function (err, productos) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

            // También podemos devolver así la información:
            res.status(200).json({ status: "ok", data: productos });

        }).populate('user').sort({"date":(date=="true"?1:-1)}).sort({"promedio":(promedio=="true"?-1:1)}).sort({"precio": (precio == "true" ? -1 : 1)});


    } else if(categoria != '' && ciudad == '' ){

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
        }).populate('user').sort({"date":(date=="true"?1:-1)}).sort({"promedio":(promedio=="true"?-1:1)}).sort({"precio": (precio == "true" ? -1 : 1)});


    }else if (categoria == '' && ciudad != '' ){

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
        }).populate('user').sort({"date":(date=="true"?1:-1)}).sort({"promedio":(promedio=="true"?-1:1)}).sort({"precio": (precio == "true" ? -1 : 1)});


    }else{

        Product.find({$and: [{ nombre : {$regex : "^"+producto }}, {"categoria": categoria}]},  function (err, producto) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));
            else {

                var products=[]

                for(var i=0;i<producto.length;i++){
                    if(producto[i].user.ciudad==ciudad){
                        products.push(producto[i])
                    }
                }

                res.status(200).json({
                    status: "ok",
                    data: products
                });
            }
        }).populate('user').sort({"date":(date=="true"?1:-1)}).sort({"promedio":(promedio=="true"?-1:1)}).sort({"precio": (precio == "true" ? -1 : 1)});

    }

}

//Se exporta controlador
module.exports=ControllerFilters