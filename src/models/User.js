// Cargamos el módulo de mongoose
const mongoose =  require('mongoose');
var Schema=mongoose.Schema;
// Usaremos los esquemas

// Creamos el objeto del esquema y sus atributos
const User = mongoose.model('users',{
    correo: {type:String, required:true, unique:true},
    pwd:  {type:String, required:true},
    nombre: {type:String, required:true},
    telefono:  {type:String, required:true},
    cedula: {type: String , required:true, unique: true},
    ciudad:  {type:String, required:true},
    isSeller: {type: Boolean},
    Save:  [{type: Schema.Types.ObjectId, ref: 'producto' }]
})

// Exportamos el modelo para usarlo en otros ficheros
module.exports = User
