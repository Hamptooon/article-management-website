const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const indexRoutes = require('./routes/indexRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/', indexRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/admin', adminRoutes);
app.all('*', (req, res) => { 
    res.status(404).render('404');
}); 

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
