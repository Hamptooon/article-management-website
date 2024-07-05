const fs = require('fs');
const path = require('path')
const bcrypt = require('bcrypt');
const dbArticles = require('../dbUtils/articles');
const dbCategories = require('../dbUtils/categories');
const dbUsers = require('../dbUtils/users');
const dbFeedbackMessages = require('../dbUtils/feedbackMessages');
const helper = require('../helpers/helpersFunctions'); 

class adminController{
    //==============================ARTICLES======================================
    async getArticlesAdminPanel(req, res){
        const articles = await dbArticles.getArticles();
        await Promise.all(articles.map(async (article) => {
            article.created_short_time = helper.formatDate(article.created_time);
        }));
        await Promise.all(articles.map(async (article) => {
            article.categoryTitle = await dbCategories.getCategoryTitle(article.category_id);
        }));
        const categories =  await dbCategories.getCategories();
        res.render('adminArticlesPanel', {articles, categories});
    
    }

    async getArticle(req, res){
        const articleId = req.params.id;
        const article = await dbArticles.getArticleById(articleId);
    
        if(article){
            console.log("1231=20-=401240");
            return res.json({article});
        }
        else{
            return res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }
    }

    async addArticle(req, res){
        const { category_id, title, description, content, is_hidden } = req.body;
        const image_path = req.file ? req.file.filename : '';
        console.log(is_hidden);
        console.log(is_hidden);
        if (!category_id || !title || !description || !content || !image_path) {
            return res.json({ success: false, message: 'Все поля обязательны для заполнения' });
        }
    
        try {
            await dbArticles.insertArticle(category_id, title, image_path, description, content, is_hidden);
            res.json({ success: true, message: 'Статья успешно добавлена' });
        } catch (error) {
            console.error('Error adding article:', error);
            console.log(error.message);
            res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }
    };

    async delArticle(req, res){
        const articleId = req.params.id;
    
        try {
            const article = await dbArticles.getArticleById(articleId);
            if (article && article.image_path) {
                const imagePath = path.join(__dirname, '..', 'public', 'img', 'articles', article.image_path);
                fs.unlink(imagePath, async (err) => {
                    if (err) {
                        console.error('Error deleting article image:', err);
                        return res.status(500).json({ success: false, message: 'Ошибка при удалении изображения статьи' });
                    }
    
                    try {
                        await dbArticles.deleteArticle(articleId);
                        return res.json({ success: true, message: 'Статья успешно удалена' });
                    } catch (error) {
                        console.error('Error deleting article:', error);
                        return res.status(500).json({ success: false, message: 'Ошибка сервера' });
                    }
                });
            } else {
                await dbArticles.deleteArticle(articleId);
                return res.json({ success: true, message: 'Статья успешно удалена' });
            }
        } catch (error) {
            console.error('Error deleting article:', error);
            return res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }
    };
    
    async editArticle(req, res){
        const {article_id, category_id, title, description, content, is_hidden} = req.body;
        console.log(req.body);
        let new_image_path = req.file ? req.file.filename : null;
    
        if (!article_id || !category_id || !title || !description || !content){
            console.log(article_id);
            console.log(category_id);
            console.log(title);
            console.log(description);
            console.log(content);
            
            
            return res.json({success : false, message : 'Заполните необходимые поля'});
        }
    
        try{
            const existingArticle = await dbArticles.getArticleById(article_id);
    
            if(new_image_path){
                const old_image_path = existingArticle.image_path;
                if(old_image_path){
                    const imagePath = path.join(__dirname, '..', 'public', 'img', 'articles', old_image_path);
                    fs.unlink(imagePath, (err) => {
                        if(err){
                            console.error('Error deleting old image article path');
                        }
                    })
                }
    
            } else{
                new_image_path = existingArticle.image_path;
            }
    
            await dbArticles.updateArticle(article_id, category_id, title, new_image_path, description, content, is_hidden);
            res.json({success : true, message : 'Статья успешно изменена'});
        }
        catch(err){
            console.log(err.message);
            res.status(500).json({success: false, message : 'Ошибка сервера'});
        }
    
    }


    //==============================CATEGORIES======================================
    async getCategoriesAdminPanel(req, res){
        const categories = await  dbCategories.getCategories();
        res.render('adminCategoriesPanel', {categories});
    
    }
    async getCategory(req, res){
        const categoryId = req.params.id;
        const category = await dbCategories.getCategoryById(categoryId);
    
        if(category){
            console.log("1111");
            return res.json({category});
        }
        else{
            return res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }
    }

    async addCategory(req, res){
        const {title} = req.body;
        const image_path = req.file ? req.file.filename : '';
        console.log(title);
        console.log(image_path);
        if (!title || !image_path) {
            return res.json({ success: false, message: 'Все поля обязательны для заполнения' });
        }
    
        try {
            await dbCategories.insertCategory(title, image_path);
            res.json({ success: true, message: 'Категория успешно добавлена' });
        } catch (error) {
            console.error('Error adding article:', error);
            console.log(error.message)
            res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }
    };

    async delCategory(req, res){
        const categoryId = req.params.id;
    
        try {
            const category = await dbCategories.getCategoryById(categoryId);
            if (category && category.image_path) {
                const imagePath = path.join(__dirname, '..', 'public', 'img', 'categories', category.image_path);
                fs.unlink(imagePath, async (err) => {
                    if (err) {
                        console.error('Error deleting category image:', err);
                        console.log("1 error");
                        return res.status(500).json({ success: false, message: 'Ошибка при удалении изображения категории' });
                    }
    
                    try {
                        await dbCategories.deleteCategory(categoryId);
                        console.log("1 success");
                        return res.status(200).json({ success: true, message: 'Категория успешно удалена' });
                    } catch (error) {
                        console.error('Error deleting article:', error);
                        console.log("2 error");
                        console.log(error.message);
                        return res.status(500).json({ success: false, message: 'Ошибка сервера' });
                    }
                });
            } else {
                await dbCategories.deleteCategory(categoryId);
                console.log("2 success");
                return res.json({ success: true, message: 'Категория успешно удалена' });
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            console.log("3 error");
            return res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }
    };
    
    async editCategory(req, res){
        const {category_id, title} = req.body;
        console.log(req.body);
        let new_image_path = req.file ? req.file.filename : null;
    
        if (!category_id || !title){
            
            
            return res.json({success : false, message : 'Заполните необходимые поля'});
        }
    
        try{
            const existingCategory = await dbCategories.getCategoryById(category_id);
    
            if(new_image_path){
                const old_image_path = existingCategory.image_path;
                if(old_image_path){
                    const imagePath = path.join(__dirname, '..', 'public', 'img', 'categories', old_image_path);
                    fs.unlink(imagePath, (err) => {
                        if(err){
                            console.error('Error deleting old image category path');
                        }
                    })
                }
    
            } else{
                new_image_path = existingCategory.image_path;
            }
    
            await dbCategories.updateCategory(category_id, title, new_image_path);
            res.json({success : true, message : 'Категория успешно изменена'});
        }
        catch(err){
            console.log(err.message);
            res.status(500).json({success: false, message : 'Ошибка сервера'});
        }
    
    }
    

    //==============================USERS======================================
    async getUsersAdminPanel(req, res){
        const users = await dbUsers.getUsers();
        res.render('adminUsersPanel', {users});
    
    }
    
    async addUser(req, res){
        const { username, email, password, role } = req.body;
        console.log(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        
        if (!username || !email || !password || !role) {
            return res.json({ success: false, message: 'Все поля обязательны для заполнения' });
        }
    
        try {
            await dbUsers.insertUser(username, email, hashedPassword, role);
            res.json({ success: true, message: 'Пользователь успешно добавлен' });
        } catch (error) {
            console.error('Error adding article:', error);
            res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }
    };
    
    async delUser(req, res){
        const userId = req.params.id;
    
        try {
            await dbUsers.deleteUser(userId);
            res.json({ success: true, message: 'Пользователь успешно удален' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }
    };


    //==============================FEEDBACK======================================
    async getFeedbackAdminPanel(req, res){
        console.log("33333");
        const feedbacks = await dbFeedbackMessages.getFeedbackMessages();
    
        await Promise.all(feedbacks.map(async (feedback) => {
            feedback.created_short_time = helper.formatDate(feedback.created_time);
            console.log(dbUsers.getUserById(feedback.user_id));
            const user = await dbUsers.getUserById(feedback.user_id);
            feedback.user_email = user.email;
        }));
        console.log(feedbacks);
        res.render('adminFeedbackPanel', {feedbacks});
    };
}

module.exports = new adminController();