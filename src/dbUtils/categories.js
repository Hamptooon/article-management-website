const db = require('../db');

class dbCategories{
    //==============================GET======================================
    getCategories(){
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM categories';
            db.query(query, (err, categories) => {
                if (err) reject(err);
                resolve(categories);
            });
        });
    };
    
    getCategoryTitle(categoryId){
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM categories WHERE id = ?';
            db.query(query, [categoryId], (err, result) => {
                if (err) reject(err);
                const category = result[0];
                resolve(category ? category.title : 'Неизвестная категория');
            });
        });
    };
    
    getCategoryById(categoryId){
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM categories WHERE id = ?';
            db.query(query, [categoryId], (err, result) => {
                if (err) reject(err);
                const category = result[0];
                resolve(category);
            });
        });
    };
    

    //==============================INSERT======================================
    insertCategory(title, image_path){
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO categories (title, image_path) VALUES (?, ?)';
            db.query(query, [title, image_path], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    };


    //==============================DELETE======================================
    deleteCategory(id){
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM categories WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    };
    
    
    //==============================UPDATE======================================
    updateCategory(id, title, image_path){
        return new Promise((resolve, reject) => {
            const query = 'UPDATE categories SET title = ?, image_path = ? WHERE id = ?';
            db.query(query, [title, image_path, id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = new dbCategories();