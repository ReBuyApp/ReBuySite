// Defines the way in which the client requests are handled by the application endpoints
const express = require("express");
const productCtrl = require('../Controllers/Product-ctrl');
const router = express.Router();

//create
router.post('/product', productCtrl.createProduct);

module.exports = {
  routes: router
}


/*const express = require("express");
const upload = require("../middlewares/upload");
const ProductCtrl = require("../controllers/Product-ctrl");

const router = express.Router();

router.post("/product", upload.array("images", 10), ProductCtrl.createProduct);
router.put(
  "/product/:id",
  upload.array("images", 10),
  ProductCtrl.updateProduct
);
router.delete("/product/:id", ProductCtrl.deleteProduct);
router.get("/product/:id", ProductCtrl.getProductById);
router.get("/products", ProductCtrl.getProducts);
router.get("/products/search", ProductCtrl.search);
router.get("/products/sort", ProductCtrl.sort);
router.get("/products/groupBy", ProductCtrl.groupBy);

router.get("/products/groupByCity", ProductCtrl.groupByCity);
router.get("/products/mapreduce", ProductCtrl.mapAndReduce);
router.get("/scrape", ProductCtrl.scrape);
module.exports = router;*/
