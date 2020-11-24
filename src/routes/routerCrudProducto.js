const  {Router} =require('express')
const route=Router()
const  controllerProducto=require('../controllers/controllerCrudProducto')
const protectedRoutes=require('../helpers/protectedRoutes')

route.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin","https://glacial-everglades-42121.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","https://peaceful-ridge-86113.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","http://localhost:3000/")
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
    next()
});

route.get('/:id?',protectedRoutes.verifyToken,controllerProducto.obtener)
route.post('/',protectedRoutes.verifyToken,controllerProducto.crear)
route.put('/:id',protectedRoutes.verifyToken,controllerProducto.actualizar)
route.delete('/:id',protectedRoutes.verifyToken,controllerProducto.eliminar)


module.exports =route