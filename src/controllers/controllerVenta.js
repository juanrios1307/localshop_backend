const ControllerVenta={}
const Producto=require('../models/Producto')
const User=require('../models/User')
const Chat=require('../models/Chat')
const Venta=require('../models/Venta')
const nodemailer = require("nodemailer");
const delay = require("delay");

ControllerVenta.obtenerVentas  = (req,res)=>{

    const user=req.decoded.sub
    if(req.params.id) {
        const id=req.params.id

        Venta.find({$and:[{"_id":id,"productos.vendedor":user}]},function(err,venta){
            if (err) {
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(203).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));
            } else {

                res.status(200).json({status: "ok", data: venta});

            }

        }).populate('productos.vendedor').populate('comprador').populate('productos.producto')

    }else{

        Venta.find({"productos.vendedor": user}, function (err, ventas) {
            if (err) {
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(203).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));
            } else {



                res.status(200).json({status: "ok", data: ventas});

            }
        }).populate('productos.vendedor').populate('comprador').populate('productos.producto')
    }

}

ControllerVenta.obtenerCompras = (req,res)=>{

    const user=req.decoded.sub

    if(req.params.id) {

        const id=req.params.id

        Venta.find({$and:[{"_id":id,"comprador":user}]},function(err,venta){
            if (err) {
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(203).send({
                    status: "error",
                    data: err
                }));
            } else {

                res.status(200).json({status: "ok", data: venta});

            }

        }).populate('productos.vendedor').populate('comprador').populate('productos.producto')

    }else {

        Venta.find({"comprador": user}, function (err, ventas) {
            if (err) {
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(422).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));
            } else {

                res.status(200).json({status: "ok", data: ventas});

            }
        }).populate('productos.vendedor').populate('comprador').populate('productos.producto')
    }
}

ControllerVenta.obtenerInfoVenta = (req,res)=>{

    const user=req.decoded.sub;
    const bool=req.headers['bool'];

    if(bool=="true"){
        User.findById(user, {"Save":1 ,"_id":0},async function  (err, saves) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));


            var object=[]
            var Total=0;

            const pubs=saves.Save


            for(var i=0;i<pubs.length;i++){

                const cantidad=pubs[i].cantidad;

                await Producto.findById(pubs[i].producto,function (err,product){
                    if (err)
                        // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                        return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));
                    else{

                        const producto = product.nombre;
                        const precio = product.precio;
                        const vendedor = product.user.nombre;
                        const telefono = product.user.telefono;


                        const total = precio * cantidad;
                        const comision = total * 0.05;

                        const object1 = {
                            producto,
                            precio,
                            vendedor,
                            telefono,
                            cantidad,
                            total,
                            comision
                        }

                        Total+=total;
                        object.push(object1)

                    }
                    // También podemos devolver así la información:

                }).populate('user')

            }

            res.status(200).json({ status: "ok", data: object,total:Total});

        })

    }else {

        const producto = req.headers['producto'];
        const cantidad = req.headers['cantidad'];


        Producto.findById(producto, function (err, product) {
            if (err) {
                return (res.type('json').status(203).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));
            } else {

                const producto = product.nombre;
                const precio = product.precio;
                const vendedor = product.user.nombre;
                const telefono = product.user.telefono;

                const total = precio * cantidad;
                const comision = total * 0.05;

                const object = {
                    producto,
                    precio,
                    vendedor,
                    telefono,
                    cantidad,
                    total,
                    comision
                }

                res.status(200).json({status: "ok", data: object});

            }

        }).populate('user')
    }
}

ControllerVenta.crearVenta = async (req, res) => {

    const comprador = req.decoded.sub

    const {metodoPago,bool,producto,cantidad} = req.body


    if(bool=="true") {

        var estado

        if (metodoPago == "tarjeta") {
            estado = "aprobado"
        } else if (metodoPago == "contraentrega") {
            estado = "pendienterecibo"
        } else if (metodoPago == "giro") {
            estado = "pendientepago"
        }

        const registro = new Venta({
            comprador,
            total:0,
            comision:0,
            metodoPago,
            estado

        })

        await registro.save()

        var transporter = nodemailer.createTransport({
            service: 'Outlook365',
            auth: {
                user: 'localshop20202@outlook.com',
                pass: '2Juan1Santiago'
            }
        });
        //Almacena compra
        User.findByIdAndUpdate(comprador, {$push: {"Compras": registro.id}}, async function (err) {
            if (err) {
                // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                return res.status(203).json({status: "error", data: "Error almacenando compra en comprador: " + comprador});
            } else {


                User.findById(comprador, {"Save": 1, "_id": 0}, async function (err, saves) {
                    if (err) {
                        // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                        return (res.type('json').status(203).send({
                            status: "error",
                            data: "Error buscando comprador"
                        }));
                    } else {
                        var pubs = saves.Save

                        for (var i = 0; i < pubs.length; i++) {

                            await delay(1000);

                            var cantidad = (pubs[i].cantidad)


                            await Producto.findById(pubs[i].producto, function (err, product) {
                                if (err) {
                                    // Si se ha producido un error, salimos de la función devolviendo  código http 422
                                    (res.type('json').status(203).send({
                                        status: "error",
                                        data: "Error buscando producto"
                                    }));

                                    return
                                } else {

                                    var total = product.precio * cantidad
                                    var comision = total * 0.05


                                    const PRODUCTO = {
                                        vendedor: product.user,
                                        producto: product.id,
                                        cantidad: cantidad,
                                        precio: product.precio,
                                        comision: comision,
                                        total: total
                                    }

                                     Venta.findByIdAndUpdate(registro.id, {$push: {productos: PRODUCTO}},  function (err) {
                                        if (err) {
                                            res.type('json').status(203).send({
                                                status: "error",
                                                data: "Error actualizando venta P"
                                            });
                                        } else {

                                              Venta.findById(registro.id,  function (err, venta){
                                                if(err){
                                                    res.type('json').status(203).send({
                                                        status: "error",
                                                        data: "Error buscando venta"
                                                    });
                                                }else{
                                                     Venta.findByIdAndUpdate(registro.id, {$set: {"total": (venta.total +total)}},  function (err) {
                                                        if (err) {
                                                            res.type('json').status(203).send({
                                                                status: "error",
                                                                data: "Error actualizando venta t"
                                                            });
                                                        } else {
                                                             Venta.findByIdAndUpdate(registro.id, {$set: {"comision": (venta.comision + comision)}},  function (err) {
                                                                if (err) {
                                                                    res.type('json').status(203).send({
                                                                        status: "error",
                                                                        data: "Error actualizando venta c"
                                                                    });
                                                                } else {


                                                                    Producto.findByIdAndUpdate(product.id, {$set: {"stock": (product.stock - cantidad)}},  function (err) {
                                                                        if (err) {
                                                                            //res.send(err);
                                                                            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                                                            res.type('json').status(203).send({
                                                                                status: "error",
                                                                                data: "Error actualizando stock"
                                                                            });
                                                                        } else {

                                                                            delay(500) //DELAY

                                                                            var mailOptions = {
                                                                                from: 'localshop20202@outlook.com',
                                                                                to: product.user.correo,
                                                                                subject: "Nueva venta",
                                                                                text: "Hola, " + product.user.nombre + " acabas de vender " + cantidad + " unidades de tu producto " + product.nombre
                                                                            };

                                                                            transporter.sendMail(mailOptions, function (error, info) {
                                                                                if (error) {

                                                                                } else {

                                                                                }
                                                                            });


                                                                            Chat.find({$and: [{"user": comprador}, {"seller": product.user.id}]},async function (err, chat) {
                                                                                if (err)
                                                                                    // Si se ha producido un error, salimos de la función devolviendo  código http 422
                                                                                    return (res.type('json').status(422).send({
                                                                                        status: "error",
                                                                                        data: "No se puede procesar la entidad, datos incorrectos!"
                                                                                    }));

                                                                                else {
                                                                                    if (chat.length == 0) {

                                                                                        console.log("chat nuevo  ")

                                                                                       const chatVenta = new Chat({
                                                                                            user:comprador,
                                                                                            seller: product.user,
                                                                                            Mensajes: []
                                                                                        })

                                                                                        await chatVenta.save()

                                                                                        Chat.findById(chatVenta.id, function (err,chat){
                                                                                            if (err) {
                                                                                                // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                                                                                res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+chatVenta.id});
                                                                                            } else {
                                                                                                console.log("cantidad chat nuevo : "+cantidad)

                                                                                                const mensaje ="Hola, Soy "+chat.user.nombre+", acabo de comprar tu producto "+ product.nombre

                                                                                                var Mensaje={
                                                                                                    mensaje,
                                                                                                    emisor:"user"
                                                                                                }

                                                                                               Chat.findByIdAndUpdate(chatVenta.id,{  $push : { Mensajes : Mensaje}},  function (err) {
                                                                                                    if (err) {
                                                                                                        // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                                                                                        res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
                                                                                                    } else {

                                                                                                    }
                                                                                                });

                                                                                            }
                                                                                        }).populate('user');//crea el chat

                                                                                       await User.findByIdAndUpdate(comprador, {$push: {Chats: chatVenta.id}},   function (err) {
                                                                                            if (err) {
                                                                                                // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                                                                                res.status(404).json({
                                                                                                    status: "error",
                                                                                                    data: "No se ha encontrado el usuario con id: " + user
                                                                                                });
                                                                                            } else {
                                                                                                User.findByIdAndUpdate(product.user.id, {$push: {Chats: chatVenta.id}},  function (err) {
                                                                                                    if (err) {
                                                                                                        // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                                                                                        res.status(404).json({
                                                                                                            status: "error",
                                                                                                            data: "No se ha encontrado el usuario con id: " + user
                                                                                                        });
                                                                                                    } else {

                                                                                                    }

                                                                                                })

                                                                                            }
                                                                                        })//guarda chats en comprador y seller


                                                                                    }

                                                                                    else {

                                                                                        var mensaje ="Hola, Soy "+chat[0].user.nombre+", acabo de comprar tu producto "+ product.nombre


                                                                                        var Mensaje={
                                                                                            mensaje,
                                                                                            emisor:"user"
                                                                                        }

                                                                                        Chat.findByIdAndUpdate(chat[0]._id,{  $push : { Mensajes : Mensaje}}, function (err) {
                                                                                            if (err) {
                                                                                                // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                                                                                res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+chat[0]._id});
                                                                                            } else {

                                                                                            }

                                                                                        })//añade mensaje al chat

                                                                                    }

                                                                                }
                                                                            }).populate("user")//Busca si chat entre comprador y vendedor existe o lo crea

                                                                            User.findByIdAndUpdate(product.user, {$push: {"Ventas": registro.id}},  function (err) {
                                                                                if (err) {
                                                                                    // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                                                                    return res.status(203).json({
                                                                                        status: "error",
                                                                                        data: "Error almacenando venta en vendedor: " + product.user
                                                                                    });
                                                                                } else {

                                                                                }
                                                                            }) //Agrega venta a usuario

                                                                        }
                                                                    }); //Actualiza stock
                                                                }
                                                            })//Actualiza total
                                                        }
                                                    })//Actualiza total
                                                }
                                            })//Busca VENTA*/

                                        }
                                    })//Agrega productos
                                }
                            }).populate('user') //Busca PRODUCTO
                        }//Cierra for

                        await Venta.findById(registro.id, async function(err,venta){
                            if(err){
                                return res.status(203).json({status: "error", data: "Error almacenando compra en comprador: " + comprador});
                            }else{
                                if(venta.productos==null || venta.productos.length==0){

                                    return res.status(203).json({status: "error", data: "Ha ocurrido un problema en el sistema, por favor reintenta el proceso de compra"});
                                }else{
                                    //Elimina lista de deseos
                                    await User.findByIdAndUpdate(comprador, {$unset:{Save:""}},{multi:true}, function (err) {
                                        if (err) {
                                            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                            return res.status(203).json({status: "error", data: "No se ha encontrado el usuario con id: " + comprador});
                                        } else {
                                            return res.status(200).json({status:"ok",data:"Compra Realizada",id:registro.id})
                                        }
                                    });//Elimina carrito
                                }
                            }
                        })//Busca venta

                    }

                }) //Busca ProductosGardados



               // return res.status(200).json({status:"ok",data:"Venta Realizada"})
            }
        })


    }


    else{ //para 1 solo producto

        var estado

        if (metodoPago == "tarjeta") {
            estado = "aprobado"
        } else if (metodoPago == "contraentrega") {
            estado = "pendienterecibo"
        } else if (metodoPago == "giro") {
            estado = "pendientepago"
        }

        const registro = new Venta({
            comprador,
            total:0,
            comision:0,
            metodoPago,
            estado

        })

        await registro.save()

        var transporter = nodemailer.createTransport({
            service: 'Outlook365',
            auth: {
                user: 'localshop20202@outlook.com',
                pass: '2Juan1Santiago'
            }
        });
        //Almacena compra
        User.findByIdAndUpdate(comprador, {$push: {"Compras": registro.id}}, async function (err) {
            if (err) {
                // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                return res.status(203).json({status: "error", data: "Error almacenando compra en comprador: " + comprador});
            } else {

                await delay(500);

                await Producto.findById(producto, async function (err, product) {
                    if (err) {
                        // Si se ha producido un error, salimos de la función devolviendo  código http 422
                        (res.type('json').status(203).send({
                            status: "error",
                            data: "Error buscando producto"
                        }));
                        return
                    } else {
                        var total = product.precio * cantidad
                        var comision = total * 0.05

                        const PRODUCTO = {
                            vendedor: product.user,
                            producto: product.id,
                            cantidad: cantidad,
                            precio: product.precio,
                            comision: comision,
                            total: total
                        }

                        Venta.findByIdAndUpdate(registro.id, {$push: {productos: PRODUCTO}}, async function (err) {
                            if (err) {
                                res.type('json').status(203).send({
                                    status: "error",
                                    data: "Error actualizando venta p"+err
                                });
                            } else {

                                await Venta.findByIdAndUpdate(registro.id, {$set: {"total": (total)}}, async function (err) {
                                    if (err) {
                                        res.type('json').status(203).send({
                                            status: "error",
                                            data: "Error actualizando venta t"
                                        });
                                    } else {
                                        await Venta.findByIdAndUpdate(registro.id, {$set: {"comision": (comision)}}, function (err) {
                                            if (err) {
                                                res.type('json').status(203).send({
                                                    status: "error",
                                                    data: "Error actualizando venta c"
                                                });
                                            } else {
                                                Producto.findByIdAndUpdate(product.id, {$set: {"stock": (product.stock - cantidad)}}, async function (err) {
                                                    if (err) {
                                                        //res.send(err);
                                                        // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                                        res.type('json').status(203).send({
                                                            status: "error",
                                                            data: "Error actualizando stock"
                                                        });
                                                    } else {
                                                        User.findByIdAndUpdate(product.user, {$push: {"Ventas": registro.id}}, async function (err) {
                                                            if (err) {
                                                                        // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                                                return res.status(203).json({
                                                                    status: "error",
                                                                    data: "Error almacenando venta en vendedor: " + product.user
                                                                });
                                                            } else {
                                                                await delay(500) //DELAY

                                                                Chat.find({$and: [{"user": comprador}, {"seller": product.user}]}, function (err, chat) {
                                                                    if (err)
                                                                        // Si se ha producido un error, salimos de la función devolviendo  código http 422
                                                                        return (res.type('json').status(422).send({
                                                                            status: "error",
                                                                            data: "No se puede procesar la entidad, datos incorrectos!"
                                                                        }));

                                                                    else {
                                                                        if (chat.length == 0) {

                                                                            const chatVenta = new Chat({
                                                                                user:comprador,
                                                                                seller: product.user,
                                                                                Mensajes: []
                                                                            })

                                                                            chatVenta.save()

                                                                            User.findByIdAndUpdate(comprador, {$push: {Chats: chatVenta.id}}, function (err) {
                                                                                if (err) {
                                                                                    // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                                                                    res.status(404).json({
                                                                                        status: "error",
                                                                                        data: "No se ha encontrado el usuario con id: " + user
                                                                                    });
                                                                                } else {

                                                                                    User.findByIdAndUpdate(product.user.id, {$push: {Chats: chatVenta.id}}, function (err) {
                                                                                        if (err) {
                                                                                            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                                                                            res.status(404).json({
                                                                                                status: "error",
                                                                                                data: "No se ha encontrado el usuario con id: " + user
                                                                                            });
                                                                                        } else {

                                                                                            Chat.findById(chatVenta.id,function (err,chat){
                                                                                                if (err) {
                                                                                                    // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                                                                                    res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+chatVenta.id});
                                                                                                } else {

                                                                                                    const mensaje ="Hola, Soy "+chat.user.nombre+", acabo de comprar tu producto "+ product.nombre

                                                                                                    var Mensaje={
                                                                                                        mensaje,
                                                                                                        emisor:"user"
                                                                                                    }

                                                                                                    Chat.findByIdAndUpdate(chatVenta.id,{  $push : { Mensajes : Mensaje}}, function (err) {
                                                                                                        if (err) {
                                                                                                            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                                                                                            res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
                                                                                                        } else {

                                                                                                        }

                                                                                                    })

                                                                                                }
                                                                                            }).populate('user')

                                                                                        }
                                                                                    });

                                                                                }
                                                                            });

                                                                        } else {

                                                                            Chat.findById(chat[0]._id,function (err,chat) {
                                                                                if (err) {
                                                                                    // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                                                                    res.status(404).json({
                                                                                        status: "error",
                                                                                        data: "No se ha encontrado el usuario con id: " + chat.id
                                                                                    });
                                                                                } else {

                                                                                    const mensaje = "Hola, Soy " + chat.user.nombre + ", acabo de comprar tu producto " + product.nombre

                                                                                    var Mensaje = {
                                                                                        mensaje,
                                                                                        emisor: "user"
                                                                                    }

                                                                                    Chat.findByIdAndUpdate(chat._id, {$push: {Mensajes: Mensaje}}, function (err) {
                                                                                        if (err) {
                                                                                            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                                                                            res.status(404).json({
                                                                                                status: "error",
                                                                                                data: "No se ha encontrado el chat con id: " + chat._id
                                                                                            });
                                                                                        } else {

                                                                                        }

                                                                                    })
                                                                                }
                                                                            }).populate('user')
                                                                        }
                                                                    }
                                                                }).populate("user")//Busca si chat entre comprador y vendedor existe o lo crea

                                                                var mailOptions = {
                                                                    from: 'localshop20202@outlook.com',
                                                                    to: product.user.correo,
                                                                    subject: "Nueva venta",
                                                                    text: "Hola, " + product.user.nombre + " acabas de vender " + cantidad + " unidades de tu producto " + product.nombre
                                                                };
                                                                await  transporter.sendMail(mailOptions, function (error, info) {
                                                                    if (error) {
                                                                        console.log("e: " + error)
                                                                        res.status(203).json({status: "error", data: error});
                                                                        return
                                                                    } else {
                                                                    }
                                                                });

                                                                await Venta.findById(registro.id, async function(err,venta){
                                                                    if(err){
                                                                        return res.status(203).json({status: "error", data: "Error almacenando compra en comprador: " + comprador});
                                                                    }else{
                                                                        if(venta.productos==null || venta.productos.length==0){

                                                                            return res.status(203).json({status: "error", data: "Ha ocurrido un problema en el sistema, por favor reintenta el proceso de compra"});
                                                                        }else{
                                                                            //Elimina lista de deseos
                                                                            await User.update({_id:comprador},  {  $pull : { "Save" : { "producto":producto} }}, function (err) {
                                                                                if (err) {
                                                                                    // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                                                                    return res.status(203).json({status: "error", data: "No se ha encontrado el usuario con id: " + comprador});
                                                                                } else {
                                                                                    return res.status(200).json({status:"ok",data:"Compra Realizada",id:registro.id})
                                                                                }
                                                                            });
                                                                        }
                                                                    }
                                                                })

                                                            }
                                                        }) //Agrega venta a usuario
                                                    }
                                                }); //Actualiza stock
                                            }
                                        })//Actualiza comision
                                    }
                                })//Actualiza total
                            }
                        })//Agrega productos
                    }
                }).populate('user') //Busca PRODUCTO


                 //return res.status(200).json({status:"ok",data:"Venta Realizada"})
            }
        })
    }


}

ControllerVenta.cambiarEstado = async (req,res) =>{

    const id=req.headers['id']

    Venta.findByIdAndUpdate(id,{$set : {"estado": "aprobado" }},function(err){
            if (err) {
                //res.send(err);
                // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                res.status(203).json({ status: "error", data: "No se ha encontrado la venta"});
            } else {
                // Devolvemos el código HTTP 200.
                res.status(200).json({ status: "ok", data: "Estado actualizado" });
            }
    });

}

ControllerVenta.obtenerMetodosPago = async (req,res) =>{

    const user=req.decoded.sub


    const bool=req.headers['bool'];

    if(bool=="true") {

        User.findById(user, {"Save":1 ,"_id":0},async function  (err, saves) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));


            var object = []
            var user=[]

            const pubs = saves.Save


            await Producto.findById(pubs[0].producto,async function (err,product){
                if (err)
                    // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                    return (res.type('json').status(422).send({
                        status: "error",
                        data: "No se puede procesar la entidad, datos incorrectos!"
                    }));
                else {
                   await user.push(product.user)
                }
            })


            var sameUser=true


            var i=1

            while(i<pubs.length){

                await Producto.findById(pubs[i].producto,async function (err,product){
                    if (err)
                        // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                        return (res.type('json').status(203).send({
                            status: "error",
                            data: "No se puede procesar la entidad, datos incorrectos!"
                        }));
                    else {

                      if(product.user.toString()==user[0].toString()){
                          sameUser = true
                           i++
                       }else{
                           sameUser = false
                           i=pubs.length
                       }

                    }
                })
            }


            if(sameUser == true) {
                await Producto.findById(pubs[0].producto, function (err, product) {
                    if (err) {
                        // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                        return (res.type('json').status(422).send({
                            status: "error",
                            data: "No se puede procesar la entidad, datos incorrectos!"
                        }));
                    }
                    else {
                        return res.status(200).json({status: "ok", data: product.user.MetodosPago});
                    }
                    // También podemos devolver así la información:

                }).populate('user')

            }else{
                return res.status(200).json({status: "ok", data: ["tarjeta"]});
            }

        })

    }else{
        const producto = req.headers['producto'];
        const cantidad = req.headers['cantidad'];


        Producto.findById(producto, function (err, product) {
            if (err) {
                return (res.type('json').status(203).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));
            } else {

                res.status(200).json({status: "ok", data: product.user.MetodosPago});

            }

        }).populate('user')
    }

}

ControllerVenta.obtenerInfoGiro = async (req,res) =>{
    const comprador = req.decoded.sub

    const producto=req.headers['producto']
    const bool=req.headers['bool']


    if(bool=="true") {
        User.findById(comprador, async function (err, user) {
            if (err) {
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(203).send({
                    status: "error",
                    data: "Error buscando comprador"
                }));
            } else {
                //si se envia la peticion con parametros
                Producto.findById(user.Save[0].producto, function (err, producto) {
                    if (err) {
                        // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                        res.status(404).json({ status: "error", data: "No se ha encontrado el producto con id: "+id});
                    } else {
                        // También podemos devolver así la información:
                        var transporter = nodemailer.createTransport({
                            service: 'Outlook365',
                            auth: {
                                user: 'localshop20202@outlook.com',
                                pass: '2Juan1Santiago'
                            }
                        });


                        var mailOptions = {
                            from: 'localshop20202@outlook.com',
                            to: user.correo,
                            subject: "Informacion giro",
                            text: "Nombre: "+producto.user.nombre+"\nCédula: "+producto.user.cedula+
                                "\nTeléfono: "+producto.user.telefono+"\nCorreo: "+producto.user.correo
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log("e: "+error)
                                res.status(203).json({status: "error", data: error});
                            } else {
                                res.status(200).json({ status: "ok", data: producto });
                            }
                        });

                    }
                }).populate('user')
            }
        })

    }else {

        User.findById(comprador, async function (err, user) {
            if (err) {
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(203).send({
                    status: "error",
                    data: "Error buscando comprador"
                }));
            } else {
                //si se envia la peticion con parametros
                Producto.findById(producto, function (err, producto) {
                    if (err) {
                        // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                        res.status(404).json({ status: "error", data: "No se ha encontrado el producto con id: "+id});
                    } else {
                        // También podemos devolver así la información:
                        var transporter = nodemailer.createTransport({
                            service: 'Outlook365',
                            auth: {
                                user: 'localshop20202@outlook.com',
                                pass: '2Juan1Santiago'
                            }
                        });


                        var mailOptions = {
                            from: 'localshop20202@outlook.com',
                            to: user.correo,
                            subject: "Informacion giro",
                            text: "Nombre: "+producto.user.nombre+"\nCédula: "+producto.user.cedula+
                                "\nTeléfono: "+producto.user.telefono+"\nCorreo: "+producto.user.correo
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log("e: "+error)
                                res.status(203).json({status: "error", data: error});
                            } else {
                                res.status(200).json({ status: "ok", data: producto });
                            }
                        });

                    }
                }).populate('user')
            }
        })

    }
}

module.exports=ControllerVenta