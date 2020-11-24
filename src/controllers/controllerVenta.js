const ControllerVenta={}
const Producto=require('../models/Producto')
const User=require('../models/User')
const Chat=require('../models/Chat')
const Venta=require('../models/Venta')
const nodemailer = require("nodemailer");

ControllerVenta.obtenerVentas  = (req,res)=>{

    const user=req.decoded.sub
    if(req.params.id) {
        const id=req.params.id

        Venta.find({$and:{id,"vendedor":{user}}},function(err,venta){
            if (err) {
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(203).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));
            } else {

                res.status(200).json({status: "ok", data: venta});

            }

        }).populate('vendedor').populate('comprador').populate('producto')

    }else{
        Venta.find({"vendedor": user}, function (err, ventas) {
            if (err) {
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(203).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));
            } else {

                res.status(200).json({status: "ok", data: ventas});

            }
        }).populate('vendedor').populate('comprador').populate('producto')
    }

}

ControllerVenta.obtenerCompras = (req,res)=>{

    const user=req.decoded.sub

    if(req.params.id) {
        const id=req.params.id

        Venta.find({$and:{id,"comprador":{user}}},function(err,venta){
            if (err) {
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(203).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));
            } else {

                res.status(200).json({status: "ok", data: venta});

            }

        }).populate('vendedor').populate('comprador').populate('producto')

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
        }).populate('vendedor').populate('comprador').populate('producto')
    }
}

ControllerVenta.obtenerInfoVenta = (req,res)=>{

    const user=req.decoded.sub;
    const producto=req.headers['producto'];
    const cantidad=req.headers['cantidad'];;

    Producto.findById(producto, function (err,product){
        if(err){
            return (res.type('json').status(203).send({
                status: "error",
                data: "No se puede procesar la entidad, datos incorrectos!"
            }));
        } else {

            const producto=product.nombre;
            const precio=product.precio;
            const vendedor=product.user.nombre;
            const telefono=product.user.telefono;


            const total=precio*cantidad;
            const comision=total*0.05;

            const object={
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

ControllerVenta.crearVenta = async (req, res) => {

    const comprador = req.decoded.sub
    const {producto, cantidad, metodoPago} = req.body


    Producto.findById(producto, async function (err, product) {
        if (err) {
            // Si se ha producido un error, salimos de la función devolviendo  código http 422
            return (res.type('json').status(203).send({
                status: "error",
                data: "No se puede procesar la entidad, datos incorrectos!"
            }));
        } else {

            Producto.findByIdAndUpdate(product, {$set: {"stock": (product.stock - cantidad)}}, function (err) {
                if (err) {
                    //res.send(err);
                    // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                    res.status(203).json({status: "error", data: "No se ha encontrado el usuario con id: " + user});
                } else {

                }
            });

            const precio=product.precio
            const vendedor=product.user

            const total = precio * cantidad;
            const comision = total * 0.05;

            const registro = new Venta({
                comprador,
                vendedor,
                producto,
                cantidad,
                precio,
                total,
                comision,
                metodoPago

            })

            await registro.save()

            User.findByIdAndUpdate(comprador,  {  $pull : { "Save" : { "producto":producto} }}, function (err) {
                if (err) {
                    // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                    res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
                } else {

                }
            });

            User.findByIdAndUpdate(comprador,{$push:{"Compras":registro.id}}, function(err){
                if (err) {
                    // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                    res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
                } else {

                }
            })

            User.findByIdAndUpdate(vendedor,{$push:{"Ventas":registro.id}}, function(err){
                if (err) {
                    // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                    res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+vendedor});
                } else {

                }
            })

            var transporter = nodemailer.createTransport({
                service: 'Outlook365',
                auth: {
                    user: 'localshop20202@outlook.com',
                    pass: '2Juan1Santiago'
                }
            });


            var mailOptions = {
                from: 'localshop20202@outlook.com',
                to: product.user.correo,
                subject: "Nueva venta",
                text: "Hola, "+product.user.nombre+" acabas de vender "+cantidad+" unidades de tu producto "+product.nombre
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("e: "+error)
                    res.status(203).json({status: "error", data: error});
                } else {

                }
            });

            res.status(200).json({status: "ok", data: "venta realizada"});

        }
    }).populate('user')





}

module.exports=ControllerVenta