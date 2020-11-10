const User=require('../models/User')
const Producto=require('../models/Producto')
const ServicioPago=require('../helpers/ServicioPago')


class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }

    async getMercadoPagoLink(req, res) {
        const { name, price, unit } = req.body;
        try {
            const checkout = await this.paymentService.createPaymentMercadoPago(
                name,
                price,
                unit
            );

            return res.redirect(checkout.init_point);

        } catch (err) {

            return res.status(500).json({
                error: true,
                msg: "Hubo un error con Mercado Pago"
            });
        }
    }

    webhook(req, res) {
        if (req.method === "POST") {
            let body = "";
            req.on("data", chunk => {
                body += chunk.toString();
            });
            req.on("end", () => {
                console.log(body, "webhook response");
                res.end("ok");
            });
        }
        return res.status(200);
    }
}

module.exports = PaymentController;