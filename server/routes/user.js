const express = require('express');
const router = express.Router();

const userController = require('../controller/user_controller');
const downloadData=require('../controller/download_pdf')
const utils = require('../utils');
router.get(
  '/profile/:id',
  utils.isAuth,
  userController.profile
);
router.post('/create', userController.create);
router.get('/check-email', userController.checkEmail);
router.post('/check-phone', userController.checkPhone);

router.post('/create-session', userController.createSession);

router.post('/register',  userController.registerEvent);
router.get('/download',  downloadData.csvdownload);
router.get('/unvieriedata',  downloadData.unverifiedData);
// router.get('/downloadReceipt',  downloadData.downloadReceipt);
router.get('/verified',  downloadData.verifypayment);
router.get('/alldata', downloadData.allData);


module.exports = router;
