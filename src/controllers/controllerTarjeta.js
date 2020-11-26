const ControllerTarjeta={}
const Tarjeta=require('../models/TarjetaCredito')

ControllerTarjeta.verificarTarjeta = (req,res) =>{

    const user =req.decoded.sub
    const numero=parseInt(req.headers['numero'])
    const cvc=parseInt(req.headers['cvc'])
    const mes=parseInt(req.headers['mes'])
    const year=parseInt(req.headers['year'])
    const tipo=req.headers['tipo']
    const titular=req.headers['titular'].toLowerCase()

    Tarjeta.find({"numero":numero},function(err,tarjeta){
        if(err || tarjeta.length==0){
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(203).json({ status: "error", data: "Por favor verifique los datos"});
        }else{

            if(tarjeta[0].cvc === cvc &&
            tarjeta[0].mes === mes &&
            tarjeta[0].year === year &&
            tarjeta[0].tipo === tipo &&
            tarjeta[0].titular === titular ){
                // También podemos devolver así la información:
                res.status(200).json({ status: "ok", data: "Tarjeta aceptada por el sistema, " +
                        "da click para continuar la compra" });
            }else{
                // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                res.status(203).json({ status: "error", data: "Por favor verifique los datos"});
            }

        }
    })

}

ControllerTarjeta.crear= async (req,res)=>{
    var {numero,cvc,mes,year,tipo,titular} =req.body //atributos

    const registro=new Tarjeta({
        numero,
        cvc,
        mes,
        year,
        tipo,
        titular
    })

    await  registro.save()

    res.status(200).json({
        mensaje:"t r"
    })


}


module.exports=ControllerTarjeta