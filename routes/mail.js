const  express = require('express');
const router = express.Router();

const mailCtrl = require('../controllers/mail');

router.post('/', mailCtrl.sendOneMail);
router.post('/template', mailCtrl.sendOneMailTemplate);
router.post('/list', mailCtrl.sendMailsToList);

module.exports = router;
