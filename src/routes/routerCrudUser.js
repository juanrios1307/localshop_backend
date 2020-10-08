const  {Router} =require('express')
const route=Router()
const  controlUser=require('../controllers/controllerCrudUsers')
const protectedRoutes=require('../helpers/protectedRoutes')

route.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin","https://glacial-everglades-42121.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","https://peaceful-ridge-86113.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","http://localhost:3000/")
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
    next()
});

route.get('/',protectedRoutes.verifyToken,controlUser.obtener)
route.post('/',controlUser.crear)
route.put('/',protectedRoutes.verifyToken,controlUser.actualizar)
route.delete('/',protectedRoutes.verifyToken,controlUser.eliminar)



module.exports =route
