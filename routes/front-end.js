var express = require('express');
var router = express.Router();
const axios = require('axios')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home', { layout: 'layouts/full-page' });
});
/* GET home page. */
router.get('/about-us', function (req, res, next) {
  res.render('about', { title: 'Express' });
});
/* GET home page. */

router.get('/blog/:id', function (req, res, next) {
  res.render('blog-detail', { title: 'Express', layout: 'layouts/full-page' });
});

/* GET home page. */
router.get('/gallery', function (req, res, next) {
  res.render('gallery', { layout: 'layouts/full-page' });
});
router.get('/contacts', function (req, res, next) {
  res.render('contacts', { layout: 'layouts/full-page' });
});
router.get('/shop', async function (req, res, next) {
  const product = await axios({
    url: process.env.BASE_DOMAIN + '/api/get-all-product',
    method: 'GET'
  })
  res.render('shop', { layout: 'layouts/full-page', productList: product.data });
});
router.get('/product/:id',async function (req, res, next) {
  let selectedId = req.params.id;
  const product = await axios({
    method: 'GET',
    url: process.env.BASE_DOMAIN + "/api/product/" + selectedId
  })
  console.log(product.data)
  res.render('shop-detail', { layout: 'layouts/full-page', product: product.data });
});
router.get('/checkout', function (req, res) {
  res.render('checkout', { layout: 'layouts/full-page' })
})

module.exports = router;
