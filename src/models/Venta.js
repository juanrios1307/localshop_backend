// Cargamos el módulo de mongoose
const mongoose =  require('mongoose');
var Schema=mongoose.Schema;
// Usaremos los esquemas

// Creamos el objeto del esquema y sus atributos
const Venta = mongoose.model('venta',{
    comprador: { type: Schema.ObjectId, ref: 'users' },
    vendedor: { type: Schema.ObjectId, ref: 'users' },
    producto:{type:Schema.ObjectId , ref:'producto'},
    cantidad: {type:Number,required:true},
    precio: {type:Number,required:true},
    total: {type:Number, required:true},
    comision: {type:Number , required:true},
    metodoPago : {type:String, required:true},
    date:{type: Date, default: Date.now}
})

// Exportamos el modelo para usarlo en otros ficheros
module.exports = Venta
