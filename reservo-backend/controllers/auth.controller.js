const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

async function register(req, res, next) {
  try {
    const { name, email, password, phone } = req.body

    const existing = await User.findOne({ where: { email } })
    if (existing) {
      return res.status(409).json({ success: false, message: 'El email ya está registrado' })
    }

    const password_hash = await bcrypt.hash(password, 10)

    const user = await User.create({ name, email, password_hash, phone })

    const token = generateToken(user)

    res.status(201).json({
      success: true,
      message: 'Usuario registrado',
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      }
    })
  } catch (error) {
    next(error)
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' })
    }

    const token = generateToken(user)

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      }
    })
  } catch (error) {
    next(error)
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    })

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
    }

    res.json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login, me }