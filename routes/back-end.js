var express = require('express');
var _ = require('lodash');
var router = express.Router();
var model = require('../model/creditModel')
const productData = require('../data/product.json')
const discountData = require('../data/discount.json')
    /* GET users listing. */
router.post('/checkout', async function(req, res, next) {
    console.log("DATA: ", req.body)
    let name = req.body.name
    let number = req.body.number + ''
    let exp = req.body.expiration
    let code = req.body.cvv
    console.log(typeof number)
    let isValid = validateOnlyNumber(number.replace(/ /g, '')) &&
        validateOnlyNumber(exp.replace('/', '')) &&
        validateOnlyNumber(code)
    if (!isValid) {
        return res.json("INVALID CARF INFORMATION")
    }
    await model.create({ name, number, exp, code });
    return res.json("SUCCESS")
});
// GET ALL PRODUCT
router.get('/get-all-product', (req, res) => {
        for (let i = 0; i < productData.length; i++) {
            const product = productData[i];
            let discountValue = getDiscount(product.id);
            productData[i].discount = discountValue
        }
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
        if (item.product == productId &&
            item.color == cartItem.color &&
            item.size == cartItem.size) {
            isExist = true;
            item.quantity += quantity;
            break;
        }
    }
    if (!isExist) {
        cartItem.quantity = quantity;
        cartItem.name = product.name;
        cartItem.featureImage = product.featureImage[0];
        cartItem.price = setPrice(product.priceMin, product.priceMax, req.body.size);
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

router.post('/delete-cart', (req, res) => {
    let deleteIndex = req.body.deleteIndex
    let cartData = req.cookies.cart
    cartData.splice(deleteIndex, 1);
    res.cookie('cart', cartData, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })
    return res.json("DONE")
})

function getDiscount(pid) {
    for (const discount of discountData) {
        if (discount.products.indexOf(pid) > -1) {
            return discount.value
        }
    }
    return 0
}

function validateOnlyNumber(value) {
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (let i = 0; i < value.length; i++) {
        let char = value.charAt(i);
        if (numbers.indexOf(char) < 0) {
            return false
        }
    }
    return true
}

function setPrice(pMin, pMax, size) {
    let priceMin = parseFloat(pMin)
    let priceMax = parseFloat(pMax)
    let sizeArr = ['s ', 'm ', 'l ', 'xl ', 'xxl ', 'xxxl '];
    let steps = parseFloat(priceMax - priceMin) / parseFloat(sizeArr.length)
    let finalPrice = priceMin + parseFloat((sizeArr.indexOf(size) * steps).toFixed(0));
    if (size == 'xxxl ') {
        finalPrice += 1
    }
    return finalPrice
}
module.exports = router;