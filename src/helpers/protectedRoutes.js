const jwt = require("jsonwebtoken");
const config = require("../config.json");

const rutasProtegidas = {};

rutasProtegidas.verifyToken= ((req, res, next) => {
    const token = req.headers['access-token'];

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({ mensaje: 'Token inválida' });
            } else {
                req.decoded = jwt.decode(token, config.secret);
                next();
            }
        });
    } else {
        res.send({
            mensaje: 'Token no proveída.'
        });
    }
});

module.exports=rutasProtegidas;