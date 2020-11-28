// Cargamos el módulo de mongoose
const mongoose =  require('mongoose');
var Schema=mongoose.Schema;
// Usaremos los esquemas

// Creamos el objeto del esquema y sus atributos
const Tarjeta = mongoose.model('tarjetas',{
    titular:{type:String, required:true},
    cvc:    {type:Number, required:true},
    numero: {type:Number, required:true},
    mes:    {type:Number, required:true},
    year:   {type: Number , required:true},
    tipo:   {type: String , required:true},
})

// Exportamos el modelo para usarlo en otros ficheros
module.exports = Tarjeta
