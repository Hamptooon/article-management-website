const dbFeedbackMessages = require('../dbUtils/feedbackMessages');
const jwt = require('jsonwebtoken');

class feedbackController{
    async feedbackSend(req, res){
        const {userId, title, description } = req.body ;
        
        if (!userId || !title || !description) {
            return res.json({ success: false, message: 'Все поля обязательны для заполнения' });
        }
        try {
            await dbFeedbackMessages.insertFeedbackMessage(userId, title, description ); // Метод для вставки данных в базу данных
            res.json({ success: true });
        } catch (error) {
            console.error('Error inserting feedback:', error);
            res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }
    };
    
    
    async getUserdId(req, res){
        const { token } = req.body;
        console.log("Это токен!!!");
        console.log(token);
        console.log(req.body);
        const decodedToken = jwt.decode(token);
        console.log("gets");
        if (decodedToken && decodedToken.id) {
            res.json({ userId: decodedToken.id });
        } else {
            res.status(400).json({ error: 'Invalid token' });
        }
    };



    async editFeedback(req, res){
        const {feedback_id} = req.params.id;
        console.log("params");
        console.log(req.params.id);
       
    
    
    
        try{
            
           
            await dbFeedbackMessages.updateApprovalStatus(req.params.id);
            res.json({success : true, message : 'Статус успешно изменена'});
        }
        catch(err){
            console.log(err.message);
            res.status(500).json({success: false, message : 'Ошибка сервера'});
        }
    
    }
}

module.exports = new feedbackController();