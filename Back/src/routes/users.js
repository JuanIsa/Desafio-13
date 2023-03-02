'use strict';
import { Router } from 'express';
import Users from '../dao/mongodb/handlerUsers.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import bcrypt from 'bcrypt';
import passport from 'passport';
import GithubStrategy from 'passport-github2';
import dotenv from 'dotenv';
dotenv.config();

/*
    mode='production';
    dotenv.config({
        path: mode==='production' : './.env.production' ? './.env.development'
    })
*/


const usersRoute = Router();
const archivo = new Users();

usersRoute.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.URLMONGODBCONNECT,
        ttl: 1000000
    }),
    key: 'Cookie de Juan',
    secret: 'Sharvelion',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 2
    }
}));

passport.use('github', new GithubStrategy({
    clientID: 'Iv1.f78e739f656b41b4',
    clientSecret: '60bac531f1602a5f0fc9d22acc84d09533ccf237',
    callbackURL: 'http://localhost:8080/users/callback'
}, async (accessToken, refreshToken, profile, done) => {
    const userCheck = await archivo.readUser(profile['_json']);
    if (!userCheck) {
        const userLogued = await archivo.createUser({ email: profile['_json']['email'], password: '' });
        return done(null, userLogued, { status: 200, email: profile['_json']['email'] });
    } else {
        return done(null, userCheck, { status: 400, message:'Usuario ya existe en la base de datos'});
    }

}));

usersRoute.use(passport.initialize());
usersRoute.use(passport.session());

passport.serializeUser((user, done) => { 
    done(null, user);
});

passport.deserializeUser(async (id, done) => {
    const result = await archivo.readUser(id);
    done(null, result);
});

usersRoute.get('/github', passport.authenticate('github'));
usersRoute.get('/callback', passport.authenticate('github', { failureRedirect: '/auth/login', failureMessage:'Error' }), (req, res) => {
    req.session.user = { email: req.user.email };
    res.redirect('/home');
});

usersRoute.post('/register', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: 'Error', error: 'valores incompletos' });
    archivo.createUser(req.body).then(dataFile => {
        res.json(dataFile);
    });
});

const validatePassword = async (passwordSinHash, passwordConHasH) => {
    if (passwordConHasH === null || passwordConHasH === undefined) console.log('Nada que mostrar')
    return bcrypt.compare(passwordSinHash, passwordConHasH)
}

usersRoute.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: 'Error', error: 'valores incompletos' });
    archivo.readUser(req.body).then(async dataFile => {
        if (dataFile !== null) {
            const dataVerif = await validatePassword(req.body.password, dataFile.password)
            if (dataVerif) {
                req.session.user = { email: req.body.email };
                return res.json(dataFile.email);
            } else {
                return res.send(null);
            }
        } else {
            return res.json(dataFile);
        }
    });
});

usersRoute.get('/checksession', (req, res) => {
    if (req.session.user) {
        res.status(200).send({ status: 200, user: req.session.user });
    } else {
        res.status(200).send({ status: 400, user: 'No user loged' });
    }
});

usersRoute.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).send({ status: 400, user: 'No user loged' });
});

export default usersRoute;