const jwt = require('jsonwebtoken')

async function identifyUser(req,res,next) {
    const token = req.cookies.token


    if(!token){
        return res.status(401).json({
            message:"Please login first"
        })
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT)
        req.userId = decoded.userId
        next()
    } catch (err) {
        return res.status(401).json({
            message:"Invalid or expired token"
        })
    }
}

module.exports = identifyUser