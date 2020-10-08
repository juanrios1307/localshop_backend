// Cargamos el módulo de mongoose
const mongoose =  require('mongoose');
var Schema=mongoose.Schema;
// Usaremos los esquemas

// Creamos el objeto del esquema y sus atributos
const Message = mongoose.model('Message',{
    user: { type: Schema.ObjectId, ref: 'users' },
    seller: { type: Schema.ObjectId, ref: 'user' },
    mensaje:  {type:String, required:true},
    date: { type: Date, default: Date.now },
    direccion:  {type:String, required:true}
})

// Exportamos el modelo para usarlo en otros ficheros
module.exports = Message
