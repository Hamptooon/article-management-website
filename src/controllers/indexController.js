const dbArticles = require('../dbUtils/articles');
const dbCategories = require('../dbUtils/categories');
const helper = require('../helpers/helpersFunctions'); 

class indexController{

    async loadData(req, res){
        try {
            const [categories, articles] = await Promise.all([dbCategories.getCategories(), dbArticles.getArticlesUser()]);
            await Promise.all(articles.map(async (article) => {
                article.created_short_time = helper.formatDate(article.created_time);
            }));
            await Promise.all(articles.map(async (article) => {
                article.categoryTitle = await dbCategories.getCategoryTitle(article.category_id);
            }));
    
            res.render('index', { categories, articles });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    };
    
    async filterArticlesByCategory(req, res){
        console.log(":filter");
        const categoryId = req.params.categoryId;
        try {
            const [categories, articles] = await Promise.all([dbCategories.getCategories(), dbArticles.getArticlesByCategoryId(categoryId)]);
    
            await Promise.all(articles.map(async (article) => {
                article.created_short_time = helper.formatDate(article.created_time);
            }));
    
            await Promise.all(articles.map(async (article) => {
                article.categoryTitle = await dbCategories.getCategoryTitle(article.category_id);
            }));
    
            res.json({ success: true, articles, categories });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    };
    
    async allArticles(req, res){
        try {
            const [categories, articles] = await Promise.all([dbCategories.getCategories(), dbArticles.getArticlesUser()]);
    
            await Promise.all(articles.map(async (article) => {
                article.created_short_time = helper.formatDate(article.created_time);
            }));
    
            await Promise.all(articles.map(async (article) => {
                article.categoryTitle = await dbCategories.getCategoryTitle(article.category_id);
            }));
    
            res.json({ success: true, articles, categories });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    };
    
    
    async articleById(req, res){
        const articleId = req.params.id;
        try {
            const article = await dbArticles.getArticleById(articleId); 
            article.created_short_time = helper.formatDate(article.created_time);
            article.categoryTitle = await dbCategories.getCategoryTitle(article.category_id);// метод для получения статьи из базы данных
            if (article) {
                res.json({ success: true, article });
            } else {
                res.json({ success: false, message: 'Article not found' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
}


module.exports = new indexController();