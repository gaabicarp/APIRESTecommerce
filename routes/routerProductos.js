const express = require("express");
const productosController = require("../controllers/productosController");
const router = express.Router();

router
    .route('/expensive')
    .get(productosController.expensive)

router
    .route('/cheaper')
    .get(productosController.cheaper)

router
    .route('/type')
    .get(productosController.type)

router
    .route('/prod/:name')
    .get(productosController.name)
    .post(productosController.buy)

router
    .route('/create')
    .post(productosController.create)


module.exports = router;