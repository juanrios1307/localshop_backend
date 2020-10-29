// Cargamos el módulo de mongoose
const mongoose =  require('mongoose');
var Schema=mongoose.Schema;
// Usaremos los esquemas

// Creamos el objeto del esquema y sus atributos
const Producto = mongoose.model('producto',{
    user: { type: Schema.ObjectId, ref: 'users' },
    images:  [{type: String}],
    especificaciones: {type:String, required:true},
    precio : {type:String, required:true},
    categoria : {type: String ,required:true},
    nombre : {type: String , required:true},
    promedio:{type:String,required:true},
    Comments:  [
        {user: {type: Schema.Types.ObjectId, ref: 'users'},
            comment: {type:String, required:true},
            rating:  {type:String, required:true},
            date: { type: Date, default: Date.now() }
        }]
})

// Exportamos el modelo para usarlo en otros ficheros
module.exports = Producto
