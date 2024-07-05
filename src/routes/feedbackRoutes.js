const express = require('express');
const path = require('path');
const feedbackController = require('../controllers/feedbackController')
const router = express.Router();

router.get('/',(req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'feedback.html'));
});


router.post('/', feedbackController.feedbackSend);

router.post('/getCurrUserId', feedbackController.getUserdId);

router.post('/setStatus/:id', feedbackController.editFeedback);

module.exports = router;
