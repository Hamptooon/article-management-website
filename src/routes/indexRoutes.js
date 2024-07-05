const express = require('express');
const indexController = require('../controllers/indexController');
const router = express.Router();

router.get('/', indexController.loadData);
router.get('/articles/:categoryId', indexController.filterArticlesByCategory);
router.get('/articles', indexController.allArticles);
router.get('/article/:id', indexController.articleById);
module.exports = router;
