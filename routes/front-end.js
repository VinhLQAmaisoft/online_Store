var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home', { layout: 'layouts/full-page' });
});
/* GET home page. */
router.get('/about-us', function (req, res, next) {
  res.render('about', { title: 'Express' });
});
/* GET home page. */
router.get('/fashion-blogs', function (req, res, next) {
  res.render('blog-achive', { title: 'Express' });
});
router.get('/blog/:id', function (req, res, next) {
  res.render('blog-detail', { title: 'Express', layout: 'layouts/full-page' });
});

/* GET home page. */
router.get('/gallery', function (req, res, next) {
  res.render('gallery',  { layout: 'layouts/full-page' });
});
router.get('/contacts', function (req, res, next) {
  res.render('contacts',  { layout: 'layouts/full-page' });
});
router.get('/shop', function (req, res, next) {
  res.render('shop', { layout: 'layouts/full-page' });
});
router.get('/product/:id', function (req, res, next) {
  res.render('shop-detail', { layout: 'layouts/full-page' });
});
router.get('/checkout',function (req,res){
  res.render('checkout',{layout: 'layouts/full-page' })
})

module.exports = router;
