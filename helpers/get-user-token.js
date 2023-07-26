import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const getUserByToken = async (token) => {
    if(!token) {
        return res.status(401).json({ message: 'Acesso negado!' })
    }
    const decoded = jwt.verify(token, 'nosso-secret')
    const userId = decoded.id

    const user = await User.findByPk(userId,{ raw: true})

    return user
}

export default getUserByToken