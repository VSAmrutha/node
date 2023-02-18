const {createProduct, getAllProducts,getSingleProduct, updateProduct, deleteProduct, uploadImage}=require('../controllers/productController')
const express=require('express');
const {authenticateUser,authorizePermissions}=require('../middleware/authentication')
const router=express.Router();

router.route('/').post([authenticateUser,authorizePermissions('admin')],createProduct).get(getAllProducts);
// /uploadImage must be placed before /:id so that upload image is not taken for /:id route
router.route('/uploadImage').post([authenticateUser,authorizePermissions('admin')],uploadImage)
router.route('/:id').get(getSingleProduct).patch(authenticateUser,authorizePermissions('admin'),updateProduct).delete(authenticateUser,authorizePermissions('admin'),deleteProduct);


module.exports=router;