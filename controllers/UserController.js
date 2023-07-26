import bcrypt from 'bcrypt'
import User from "../models/User.js";
import createUserToken from '../helpers/create-user-token.js';
import getToken from '../helpers/get-token.js';
import getUserByToken from '../helpers/get-user-token.js';

class UserController {
    static async register(req, res) {
        const { name, email, office, image, password, confirmpassword, loja } = req.body
        //validations
        if (!name) {
            return res.status(422).json({ message: "O nome é obrigratório" })
        }
        if (!email) {
            return res.status(422).json({ message: "O email é obrigratório" })
        }
        if (!office) {
            return res.status(422).json({ message: "O cargo é obrigratório" })
        }
        if (!password) {
            return res.status(422).json({ message: "O password é obrigratório" })
        }
        if (!confirmpassword) {
            return res.status(422).json({ message: "O confirmpassword é obrigratório" })
        }
        if (password != confirmpassword) {
            return res.status(422).json({ message: "A comfirmação de senha não confere!" })
        }
        const userExists = await User.findOne({ where: { email } })

        if (userExists) {
            return res.status(422).json({ message: "Por favor, utilize outro email" })
        }
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)
        const user = {
            name, email, office, password: passwordHash, lojaId: loja
        }
        try {
            const newUser = await User.create(user)
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async login(req, res) {
        const { email, password } = req.body
        //validations
        if (!email) {
            return res.status(422).json({ message: "O email é obrigratório" })
        }
        if (!password) {
            return res.status(422).json({ message: "O password é obrigratório" })
        }
        const user = await User.findOne({ where: {email} })

        if (!user) {
            return res.status(422).json({ message: 'Não há usuario cadasrtrado com esse email' })
        }
        const checkPass = await bcrypt.compare(password, user.password)

        if (!checkPass) {
            return res.status(422).json({
                message: 'Senha inválida!'
            })
        }

        await createUserToken(user, req, res)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        const user = await User.findByPk(id)

        if (!user) {
            return res.status(422).json({ message: 'Usuário não encontrado!' })
        }

        return res.status(200).json({ user })
    }

    static async editUser(req, res) {
        const id = req.params.id

        // check if user exists
        const token = getToken(req)
        const user = await getUserByToken(token)

        const { name, email, office, password, lojaId, confirmpassword } = req.body

        // validations
        if (!name) {
            return res.status(422).json({ message: "O nome é obrigratório" })
        } else {
            user.name = name
        }
        if (!email) {
            return res.status(422).json({ message: "O email é obrigratório" })
        } else {
            user.email
        }
        if (!office) {
            return res.status(422).json({ message: "O cargo é obrigratório" })
        } else {
            user.office = office
        }

        const userExists = await User.findOne({ where: { email } })

        if (user.email !== email && userExists) {
            return res.status(422).json({
                message: "Por favor, utilize outro email!"
            })
        } else {
            user.email = email
        }
        if (!password) {
            return res.status(422).json({ message: "O password é obrigratório" })
        }
        if (!confirmpassword) {
            return res.status(422).json({ message: "O confirmpassword é obrigratório" })
        }
        if (password != confirmpassword) {
            return res.status(422).json({ message: "A comfirmação de senha não confere!" })
        } else if (password === confirmpassword) {
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)
            user.password = passwordHash
        }
        if (req.file) {
            user.image = req.file.filename
        }

        try {
            await User.update(user, { where: { id: id } })
            return res.status(200).json({
                message: 'Usuário atualizado com sucesso!'
            })
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
}

export default UserController