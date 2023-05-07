const express = require('express');
const mongoose = require('mongoose');
const app = express();
const connectToMongoDB = require('./connection');
const bcrypt = require('bcryptjs')
const User = require('./user');
const path = require('path');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
    uri: 'mongodb+srv://ianytlaa:fy4dMt42IWf1VKdk@cluster0.urti4xo.mongodb.net/idk',
    collection: 'session'
});

app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true}));

app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
}));

app.get('/', (req, res) => {
    res.render('index', { session: req.session });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send(' Введите емайл и пароль');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send(' Пользователь с таким емайл уже зареган');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({
        email,
        password: hashedPassword,
    });

    try {
        await user.save();
        res.send('вы успешно зарегались');
    } catch (err) {
        res.status(500).send('ошибка при сохранении в базе данных');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Введите email и пароль');
    }

    const user = await User.findOne({ email });
    if(!user) {
        return res.status(400).send('неверный email или пароль');
    }
    
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if(!isPasswordCorrect) {
        return res.status(400).send('неверный email или пароль');
    }

    req.session.isAuthenticated = true;
    req.session.user = {
        _id: user._id,
        email: user.email,
    };

    res.redirect('/');
});

async function start() {
    const uri = await connectToMongoDB();
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    app.listen(3000, () => {
        console.log('Сервер запущен на порту 3000')
    });
}

start();
