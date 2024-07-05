const express = require('express');
const path = require('path');
const multer = require('multer');
// const { authenticateToken, authorizeRole } = require('../middleware/auth');
// const { getAdminPanel,getUsersAdminPanel, getArticlesAdminPanel,getCategoriesAdminPanel, addArticle, delArticle, addCategory, addUser, delUser, delCategory, getArticle, editArticle, editCategory, getCategory, getFeedbackAdminPanel } = require('../controllers/adminController');
const adminController = require('../controllers/adminController');
const router = express.Router();

const articleStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/articles');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const categoryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/categories');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadArticle = multer({ storage: articleStorage });
const uploadCategory = multer({ storage: categoryStorage });

router.get('/', adminController.getUsersAdminPanel);


router.get('/categories', adminController.getCategoriesAdminPanel);
router.get('/categories/:id', adminController.getCategory);
router.post('/categories/add', uploadCategory.single('image'), adminController.addCategory);
router.put('/categories/edit', uploadCategory.single('image'), adminController.editCategory);
router.delete('/categories/del/:id', adminController.delCategory);

router.get('/articles', adminController.getArticlesAdminPanel);
router.get('/articles/:id', adminController.getArticle);
router.post('/articles/add', uploadArticle.single('image'), adminController.addArticle);
router.delete('/articles/del/:id', adminController.delArticle);
router.put('/articles/edit', uploadArticle.single('image'), adminController.editArticle);

router.get('/users', adminController.getUsersAdminPanel);
router.post('/users/add', adminController.addUser);
router.delete('/users/del/:id', adminController.delUser);


router.get('/feedback', adminController.getFeedbackAdminPanel);

module.exports = router;
