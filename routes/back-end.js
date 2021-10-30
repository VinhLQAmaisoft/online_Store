var express = require('express');
var _ = require('lodash');
var router = express.Router();
var model = require('../model/creditModel')
const productData = require('../data/product.json')
/* GET users listing. */
router.post('/checkout', async function (req, res, next) {
  console.log("DATA: ", req.body)
  let name = req.body.name
  let number = req.body.number
  let exp = req.body.expiration
  let code = req.body.cvv
  await model.create({ name, number, exp, code });

  return res.json("YOUR CARD PAYMENT IS NOT AVAILABLE NOW,PLEASE TRY AGAIN!")
});
// GET ALL PRODUCT
router.get('/get-all-product', (req, res) => {
  return res.json(productData)
})
// GET PRODUCT BY ID
router.get('/product/:id', (req, res) => {
  let selectedId = req.params.id;
  let selectedProduct = productData[0];
  for (const product of productData) {
    if (product.id === selectedId) {
      selectedProduct = product;
      return res.json(selectedProduct);
    }
  }
  return res.json(selectedProduct)
})
// ADD TO CART BY PRODUCT DATA
router.post('/cart', (req, res) => {
  let cartData = req.cookies.cart ? req.cookies.cart : [];
  let productId = req.body.productId;
  let quantity = parseInt(req.body.quantity);
  let product = productData.filter(product => product.id === productId)[0];
  let cartItem = {
    product: productId,
    color: req.body.color,
    size: req.body.size
  }
  console.log("CART DATA: ", cartData)
  let isExist = false;
  // CHECK IF PRODUCT IS EXIST
  for (const item of cartData) {
    if (item.product == productId
      && item.color == cartItem.color
      && item.size == cartItem.size) {
      isExist = true;
      item.quantity += quantity;
      break;
    }
  }
  if (!isExist) {
    cartItem.quantity = quantity;
    cartItem.name = product.name;
    cartItem.featureImage = product.featureImage[0];
    cartItem.price = product.priceMin;
    cartData.push(cartItem);
  }
  res.cookie('cart', cartData, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })
  console.log("COOKIE: ", req.cookies.cart)
  return res.json("DONE")
})
router.get('/cart', (req, res) => {
  let cartData = req.cookies.cart
  return res.json(cartData)
})
module.exports = router;
