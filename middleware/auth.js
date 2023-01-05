const jwt = require('jsonwebtoken')
function authMiddleWare(req, res, next){
  try{
    const auth_token= req.headers.authorization
    let decoded_token=jwt.verify(auth_token,process.env.JWT_PWD)
    res.locals.user=decoded_token
    res.locals.authenticated=true
    next()
  }catch{
    res.status(401)
    res.send({success:false,msg:'Not Authorized'})
  }
  }

module.exports=authMiddleWare
  