const jwt = require('jsonwebtoken')

const APP_SECRET = process.env.APP_SECRET || 'myappsecret'
const USERNAME = process.env.ADMIN_USERNAME || 'admin'
const PASSWORD = process.env.ADMIN_PASSWORD || 'admin'
const TOKEN_TTL = '1h'
const RESPONSE_DELAY_MS = 500

function extractToken(req) {
    const header = req.headers.authorization
    if (typeof header !== 'string' || !header.startsWith('Authentication<') || !header.endsWith('>')) {
        return null
    }

    return header.substring('Authentication<'.length, header.length - 1)
}

function isTokenValid(req) {
    const token = extractToken(req)
    if (!token) {
        return false
    }

    try {
        jwt.verify(token, APP_SECRET)

        return true
    } catch {
        return false
    }
}

function unauthorized(res) {
    res.statusCode = 401
    res.end()
}

function requiresAuth(req) {
    const path = req.path || req.url.split('?')[0]

    if (path.startsWith('/products')) {
        return req.method !== 'GET'
    }

    if (path.startsWith('/orders')) {
        return !(req.method === 'POST' && (path === '/orders' || path === '/orders/'))
    }

    return false
}

module.exports = async function (req, res, next) {
    await (new Promise(resolve => setTimeout(resolve, RESPONSE_DELAY_MS)))

    if (req.url.startsWith('/verify-token') && req.method === 'POST') {
        res.json({success: isTokenValid(req)})

        return
    }

    if ((req.url === '/api/login' || req.url === '/login') && req.method === 'POST') {
        if (req.body != null && req.body.username === USERNAME && req.body.password === PASSWORD) {
            const token = jwt.sign({data: USERNAME}, APP_SECRET, {expiresIn: TOKEN_TTL})
            res.json({success: true, token: token})
        } else {
            res.json({success: false})
        }

        return
    }

    if (requiresAuth(req) && !isTokenValid(req)) {
        unauthorized(res)

        return
    }

    next()
}
