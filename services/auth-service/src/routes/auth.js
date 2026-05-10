const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const registerRules = [
  body('username').trim().isLength({ min: 3 }).withMessage('Pseudo trop court (min 3 caractères)'),
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe trop court (min 6 caractères)'),
  body('role').optional().isIn(['ADMIN', 'OPERATOR']).withMessage('Rôle invalide')
];

const loginRules = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis')
];

router.post('/register', registerRules, authController.register);
router.post('/login', loginRules, authController.login);
router.post('/logout', authController.logout);
router.post('/verify-token', authController.verifyToken);

router.get('/me', verifyToken, authController.getMe);

module.exports = router;