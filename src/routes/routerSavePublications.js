const  {Router} =require('express')
const route=Router()
const  controlSave=require('../controllers/controllerSavePublications')
const protectedRoutes=require('../helpers/protectedRoutes')

route.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin","https://glacial-everglades-42121.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","https://peaceful-ridge-86113.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","http://localhost:3000/")
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");

    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Credentials', true)
    res.header(  "Access-Control-Allow-Headers", "access-token, Origin, Content-Type, Accept")


    next()
});


route.get('/',protectedRoutes.verifyToken,controlSave.obtener)
route.put('/',protectedRoutes.verifyToken,controlSave.crear)
route.put('/:id',protectedRoutes.verifyToken,controlSave.eliminar)


module.exports =route
