const { Router } = require('express');
const router = Router();
const User = require('../Models/User.model');
const passport = require('passport');
const passportConfig = require('../config/passport');
const JWT = require('jsonwebtoken');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const signToken = (userId) => {
    return JWT.sign({
        iss: 'secret',
        sub: userId
    }, 'secret', { expiresIn: '1h' });
}

//test
router.get('/get', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (err) {
        
    }
});

router.post('/register', async (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ message: 'email is already exists' });
        } else {
            const newUser = new User({ username, email, password });
            newUser.save((err) => {
                if (err) {
                    res.status(500).json({ message: 'error has occuerd' });
                } else {
                    res.status(201).json({ message: 'user created', user: newUser });
                }
            })
        }
    } catch (err) {
        res.status(500).json({ message: 'error has occuerd' });
    }
});

router.post('/login', passport.authenticate('local', { session: false }), async (req, res) => {
    if (req.isAuthenticated()) {
        const { _id, username } = req.user;
        const token = signToken(_id);
        res.cookie('access_token', token, { httpOnly: true, sameSite: true });
        res.status(200).json({ isAuthenticated: true, user: { username } });
    }
});

router.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.clearCookie('access_token');
    res.json({ message: 'successfully logged out' });
});

router.get('/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { username } = req.user;
    res.status(200).send({isAuthenticated: true, user: username});
});


module.exports = router;