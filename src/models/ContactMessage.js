// Cargamos el módulo de mongoose
const mongoose =  require('mongoose');
var Schema=mongoose.Schema;
// Usaremos los esquemas

// Creamos el objeto del esquema y sus atributos
const ContactMessage = mongoose.model('contactMessage',{
    date:  { type: Date, default: Date.now },
    mensaje:  {type:String, required:true},
    seller: { type: Schema.ObjectId, ref: 'users'},
    user:  { type: Schema.ObjectId, ref: 'users'}
})

// Exportamos el modelo para usarlo en otros ficheros
module.exports = ContactMessage