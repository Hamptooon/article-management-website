const express = require('express');
const path = require('path');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/user', authenticateToken, authController.getUserByToken);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'auth.html'));
});




module.exports = router;
