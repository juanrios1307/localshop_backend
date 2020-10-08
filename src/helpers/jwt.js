const expressJwt = require('express-jwt');
const config = require('../config.json');
const crudUser = require('../controllers/controllerCrudUsers');

module.exports = jwt();

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/api/users',
            '/api/workers',
            '/api/login',
            '/api/main',
            '/api/filters'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await crudUser.obtener(req,payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};
