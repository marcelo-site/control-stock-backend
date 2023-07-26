import Loja from "../models/Loja.js"

class LojaController {
    static async register(req, res) {
        const { name, city, address, state } = req.body
        if (!name) {
            return res.status(422).json({ message: "O nome é obrigratório" })
        }
        if (!city) {
            return res.status(422).json({ message: "A cidade é obrigratório" })
        }
        if (!state) {
            return res.status(422).json({ message: "O Estado é obrigratório" })
        }
        if (!address) {
            return res.status(422).json({ message: "O endereço é obrigratório" })
        }
        const loja = {
            name, city, state, address
        }
        try {
            await Loja.create(loja)
            res.status(201).json({ message: 'Loja cadastrada com sucesso!' })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async getAll(req, res) {
        const lojas = await Loja.findAll({ raw: true })
        return res.status(200).json({ lojas })
    }

    static async lojaById(req, res) {
        const id = req.params.id
        const loja = await Loja.findByPk(id)
        if (!loja) {
            return res.status(404).json({ message: 'Loja não existe no sitema!' })
        }
        return res.status(200).json({ loja })
    }

    static async editLoja(req, res) {
        const id = req.params.id
        const { name, city, state, address } = req.body
        if (!name) {
            return res.status(422).json({ message: "O name é obrigratório!" })
        }
        if (!city) {
            return res.status(422).json({ message: "A cidade é obrigratório1" })
        }
        if (!state) {
            return res.status(422).json({ message: "O estado é obrigratório!" })
        }
        if (!address) {
            return res.status(422).json({ message: "O endereço é obrigratório!" })
        }
        const loja = { name, city, state, address }

        try {
            await Loja.update(loja, { where: { id: id } })
            return res.status(200).json({
                message: 'Loja atualizado com sucesso!'
            })
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
}

export default LojaController