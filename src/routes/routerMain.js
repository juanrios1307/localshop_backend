const  {Router} =require('express')
const route=Router()
const  controlMain=require('../controllers/controllerMain')


route.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin","https://glacial-everglades-42121.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","https://peaceful-ridge-86113.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","http://localhost:3000/")
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
    next()
});

route.get('/',controlMain.obtenerProductos)
route.get('/sellers',controlMain.obtenerSellers)
route.get('/categories',controlMain.obtenerCategorias)
route.get('/promproducts',controlMain.obtenerPromotedProducts)

module.exports =route
