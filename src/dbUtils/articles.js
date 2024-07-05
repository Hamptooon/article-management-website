const db = require('../db');

class dbArticles {

    //==============================GET======================================
    getArticles() {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM articles';
            db.query(query, (err, articles) => {
                if (err) reject(err);
                resolve(articles);
            });
        });
    }


    getArticlesUser() {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM articles WHERE is_hidden = 0';
            db.query(query, (err, articles) => {
                if (err) reject(err);
                resolve(articles);
            });
        });
    }

    getArticlesByCategoryId(categoryId){
        return new Promise((resolve, reject) => {
            let query = 'SELECT id, category_id, title, image_path, description, created_time FROM articles WHERE category_id = ? and is_hidden = 0';
            db.query(query,[categoryId], (err, articles) => {
                if (err) reject(err);
                resolve(articles);
            });
        });
    };

    getArticleById(articleId) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM articles WHERE id = ?';
            db.query(query, [articleId], (err, articles) => {
                if (err) reject(err);
                resolve(articles[0]);
            });
        });
    };


    //==============================INSERT======================================
    insertArticle(category_id, title, image_path, description, content, is_hidden){
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO articles (category_id, title, image_path, description, content, is_hidden, created_time) VALUES (?, ?, ?, ?, ?, ?, NOW())';
            db.query(query, [category_id, title, image_path, description, content, is_hidden], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    };


    //==============================DELETE======================================
    deleteArticle = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM articles WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    };

    
    //==============================UPDATE======================================
    updateArticle(id, category_id, title, image_path, description, content, is_hidden){
        return new Promise((resolve, reject) => {
            const query = 'UPDATE articles SET category_id = ?, title = ?, image_path = ?, description = ?, content = ?, is_hidden = ? WHERE id = ?';
            db.query(query, [category_id, title, image_path, description, content,is_hidden, id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = new dbArticles();