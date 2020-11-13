const  {Router} =require('express')
const route=Router()
const  controlPagar=require('../controllers/controllerPagar')
const protectedRoutes=require('../helpers/protectedRoutes')

route.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin","https://peaceful-ridge-86113.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","http://localhost:3000/")
    res.header("Access-Control-Allow-Origin","https://www.mercadopago.com.co/checkout/")
    res.header("Access-Control-Allow-Origin","https://frozen-anchorage-52618.herokuapp.com/")
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Credentials', "true");
    res.header('Access-Control-Allow-headers', 'Content-Type,Authorization');
    next()
});

const PaymentController = require('../controllers/controllerPagar')
//importamos el controller

const PaymentService = require("../helpers/ServicioPago");
//importamos el service

const PaymentInstance = new PaymentController(new PaymentService());
// Permitimos que el controller pueda usar el service


route.post("/payment/new", (req, res) =>
    PaymentInstance.getMercadoPagoLink(req, res)
);

route.post("/webhook", (req, res) => PaymentInstance.webhook(req, res));

module.exports =route