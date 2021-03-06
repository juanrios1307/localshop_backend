const  {Router} =require('express')
const route=Router()
const  controlFilter=require('../controllers/controllerFilters')

route.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin","https://glacial-everglades-42121.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","https://peaceful-ridge-86113.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","http://localhost:3000/")
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
    next()
});

route.get('/precio',controlFilter.obtenerPrecio)
route.get('/ciudad',controlFilter.obtenerCiudad)
route.get('/categoria',controlFilter.obtenerCategoria)
route.get('/',controlFilter.obtenerPromedio)
route.get('/fecha',controlFilter.obtenerFecha)


module.exports =route