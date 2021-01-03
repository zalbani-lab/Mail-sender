const  express = require('express');
const router = express.Router();

const mailCtrl = require('../controllers/mail');

router.post('/', mailCtrl.sendOneMail);
router.post('/template', mailCtrl.sendOneMailTemplate);

module.exports = router;
