// Cargamos el módulo de mongoose
const mongoose =  require('mongoose');
var Schema=mongoose.Schema;
// Usaremos los esquemas

// Creamos el objeto del esquema y sus atributos
const Chat = mongoose.model('Chat',{
    user: { type: Schema.ObjectId, ref: 'users' },
    seller: { type: Schema.ObjectId, ref: 'users' },
    Mensajes:[{
        mensaje: {type: String, required: true},
        date: {type: Date, default: Date.now},
        emisor: {type: String, required: true}
    }]

})

// Exportamos el modelo para usarlo en otros ficheros
module.exports = Chat
