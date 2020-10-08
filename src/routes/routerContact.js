const  {Router} =require('express')
const route=Router()
const  controlUser=require('../controllers/controllerContact')
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


route.get('/',protectedRoutes.verifyToken,controlUser.obtener)
route.post('/:id',protectedRoutes.verifyToken,controlUser.crear)


module.exports =route
