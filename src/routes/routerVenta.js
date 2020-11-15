const  {Router} =require('express')
const route=Router()
const  controlVenta=require('../controllers/controllerVenta')
const protectedRoutes=require('../helpers/protectedRoutes')

route.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin","https://glacial-everglades-42121.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","https://peaceful-ridge-86113.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","http://localhost:3000/")
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
    next()
});

route.get('/compras',protectedRoutes.verifyToken,controlVenta.obtenerCompras)
route.get('/ventas',protectedRoutes.verifyToken,controlVenta.obtenerVentas)
route.post('/',protectedRoutes.verifyToken,controlVenta.crearVenta)


module.exports =route