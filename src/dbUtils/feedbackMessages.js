const db = require('../db');

class dbFeedbackMessages{

    //==============================GET======================================
    getFeedbackMessages(){
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM feedback_messages WHERE is_approved = 0';
            db.query(query, (err, feedbacks) => {
                if (err) reject(err);
                resolve(feedbacks);
            });
        });
    }

    //==============================INSERT======================================
    insertFeedbackMessage(userId, title, description){
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO feedback_messages (user_id, title, description, created_time) VALUES (?, ?, ?, NOW())';
            db.query(query, [userId, title, description], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    };


    updateApprovalStatus(feedbackId) {
        console.log("approce" + feedbackId)
        return new Promise((resolve, reject) => {
            const query = 'UPDATE feedback_messages SET is_approved = 1 WHERE id = ?';
            db.query(query, [feedbackId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
    


}

module.exports = new dbFeedbackMessages();
