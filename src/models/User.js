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
    Save:  [{
        producto: {type: Schema.Types.ObjectId, ref: 'producto'},
            cantidad: {type:Number, required:true}
        }],
    Productos: [{type: Schema.Types.ObjectId, ref: 'producto' }],
    Chats:  [{type: Schema.Types.ObjectId, ref: 'chat' }],
    Compras: [{type:Schema.Types.ObjectId, ref:'venta'}],
    Ventas: [{type:Schema.Types.ObjectId, ref:'venta'}]
})

// Exportamos el modelo para usarlo en otros ficheros
module.exports = User
