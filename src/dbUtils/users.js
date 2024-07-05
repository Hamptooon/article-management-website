const db = require('../db');

class dbUsers{

    //==============================GET======================================
    getUsers(){
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM users';
            db.query(query, (err, users) => {
                if (err) reject(err);
                resolve(users);
            });
        });
    };

    getUserById(userId){
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM users WHERE id = ?';
            db.query(query, [userId], (err, users) => {
                if (err) reject(err);
                resolve(users[0]);
            });
        });
    };


    //==============================INSERT======================================
    insertUser(username, email, password, role){
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
            const values = [username, email, password, role];
            db.query(query, values, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    };

    
    //==============================DELETE======================================
    deleteUser(id){
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM users WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    };

    
}

module.exports = new dbUsers();