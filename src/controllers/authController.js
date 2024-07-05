const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const dbUsers = require('../dbUtils/users');
class authController{
    async register (req, res) {
        const { username, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const userRole = role === 'admin' ? 'admin' : 'user';
        try{
            let queryRes = await dbUsers.insertUser(username, email, hashedPassword, userRole);
            let insertId = queryRes.insertId;
            const token = jwt.sign({ id: insertId, role: userRole }, process.env.SECRET, { expiresIn: '1h' });
            res.json({ success: true, message: 'Registration successful', token, insertId });
        } catch(err){
            res.json({ success: false, message: err.message });
        }
    }

    async login (req, res){
        const { email, password } = req.body;
        const query = 'SELECT * FROM users WHERE email = ?';
        db.execute(query, [email], async (err, results) => {
            if (err) return res.json({ success: false, message: 'Login failed' });
            if (results.length === 0) return res.json({ success: false, message: 'User not found' });

            const user = results[0];
            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.json({ success: false, message: 'Incorrect password' });
            const userId = user.id;
            const token = jwt.sign({ id: userId, role: user.role }, process.env.SECRET, { expiresIn: '1h' });
            res.json({ success: true, message: 'Login successful', token, userId });
        });
    }

    async getUserByToken(req, res){
        const userId = req.user.id;
        console.log("Auth UserId" + userId);
        const query = 'SELECT * FROM users WHERE id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results[0]);
        });
    }
}


module.exports = new authController();

