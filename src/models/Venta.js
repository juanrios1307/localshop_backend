ControllerUser.registerSeller=(req,res)=>{
    const user = req.decoded.sub

    const {banco,cuentabanco,MetodosPago}=req.body

    User.updateMany({_id:user},{ $set: req.body, isSeller: true }, function (err) {
        if (err) {
            //res.send(err);
            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
            res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
        } else {
            // Devolvemos el código HTTP 200.
            res.status(200).json({ status: "ok", data: "Usuario registrado como vendedor" });
        }
    });

}