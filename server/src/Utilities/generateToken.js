const jwt = require('jsonwebtoken')


const createToken  = (id,role="user") =>{
    return jwt.sign({id,role},process.env.JWT_SECRET, {expiresIn: '1d'})
    
}

module.exports = {createToken}