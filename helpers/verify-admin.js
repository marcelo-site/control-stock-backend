import getToken from "./get-token.js"
import User from "../models/User.js"
import jwt from "jsonwebtoken"

const verifyAdmin = async (req, res, next) => {
    const token = getToken(req)
    const decoded = jwt.verify(token, 'nosso-secret')
    const user = await User.findByPk(decoded.id)
    
    if(user.office === 'admin') {
       return next()
    } else {
      return res.status(401).json({message: "Acesso não autorizado!"})
    }
}

export default verifyAdmin



