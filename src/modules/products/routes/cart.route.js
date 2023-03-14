const express = require('express');
const router = express.Router();
const controller = require('../controllers/index.controller');

router.route('/test').get(controller.cart.test);

router.route('/addShop').post(controller.cart.addShop);

//add requested service to user cart
router.route('/updateService').post(controller.cart.addService)
                              .delete(controller.cart.removeService);
//add requested service to user cart
router.route('/empty').delete(controller.cart.emptyCart);
router.route('/delete').delete(controller.cart.deleteCart);

                            

router.route('/updateManyServices').post(controller.cart.updateMultiServices)

router.route('/').get(controller.cart.getCartWithServices); 
router.route('/cart/:serviceId').get(controller.cart.getCartWithServices);  
router.route('/cart/services').get(controller.cart.getCartWithServices);  






                              
module.exports = router;                     