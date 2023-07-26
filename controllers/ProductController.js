import Product from "../models/Product.js";
import fs from 'fs'
import Size from "../models/Size.js"
import Color from "../models/Color.js";
import SizeColor from "../models/SizeColor.js";
import Stock from "../models/Stock.js";
import Product_size_color from "../models/Product_size_color.js";
import Loja from "../models/Loja.js";
import getToken from "../helpers/get-token.js";
import getUserByToken from "../helpers/get-user-token.js";

class ProductController {
    static async getAll(req, res) {
        const products = await Product.findAll({
            order: [['createdAt', 'DESC']],
            raw: true
        })
        return res.status(200).json({ products })
    }

    static async productByIdAll(req, res) {
        const id = req.params.id
        const token = await getToken(req)
        const user = await getUserByToken(token)
        if (!id) {
            return res.status(404).json({ message: "Erro na  url!" })
        }
        try {
            const product = await Product.findByPk(id, { raw: true })
            const size = await Size.findAll({ raw: true })
            // const size = [
            //     {id: 1, name: p},
            //     {id: 2, name: m},
            //     {id: 3, name: g}
            // ]
            const lojas = await Loja.findByPk(user.lojaId, { raw: true })
            const color = await Color.findAll({ raw: true })
            const stock = await Stock.findAll({
                include: {
                    where: { lojaId: user.lojaId },
                    model: Product_size_color,
                    where: { productId: id },
                    include: {
                        model: SizeColor
                    }
                }, raw: true
            })
            const stockP = stock.map((el, i) => {
                if (el['product_size_color.size_color.sizeId'] == 1) {
                    return parseInt(el.stock)
                } else {
                    return 0
                }
            }).reduce((acc, cur) => parseInt(acc) + parseInt(cur), 0)

            const stockM = stock.map((el, i) => {
                if (el['product_size_color.size_color.sizeId'] === 2) {
                    return parseInt(el.stock)
                } else {
                    return 0
                }
            }).reduce((acc, cur) => acc + cur, 0)

            const stockG = stock.map((el, i) => {
                if (el['product_size_color.size_color.sizeId'] === 3) {
                    return parseInt(el.stock)
                }
                else {
                    return 0
                }
            }).reduce((acc, cur) => acc + cur, 0)

            const stocks = [stockP || 0, stockM || 0, stockG || 0]

            return res.status(200).json({product, size, lojas, color, 
                stock, stocks
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: error })
        }
    }

    static async productById(req, res) {
        const id = req.params.id
        if (!id) {
            return res.status(404).json({ message: "Erro na  url!" })
        }
        try {
            const product = await Product.findByPk(id, { raw: true })
            return res.status(200).json(product)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: error })
        }
    }

    static async register(req, res) {
        const { name, ref, price } = req.body
        const image = req.file
        if (!name) {
            res.status(422).json({ message: 'O nome do Produto é obrigatório!' })
        }
        if (!ref) {
            res.status(422).json({ message: 'A referência é obrigatório!' })
        }
        if (!price) {
            res.status(422).json({ message: 'O preço é obrigatório!' })
        }
        if (!image) {
            res.status(422).json({ message: 'A imagem é obrigatório!' })
        }

        const product = {
            name, ref, price, image: image.filename
        }
        try {
            await Product.create(product)
            return res.status(200).json({
                message: 'Produto criado com sucesso!'
            })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async createColor(req, res) {
        const { name, color } = req.body
        if (!name) {
            res.status(404).json({ message: "O nome é obrigatório!" })
        }
        if (!color) {
            res.status(404).json({ message: "A cor é obrigatório!" })
        }
        try {
            await Color.create({ name, color })
            res.status(200).json({ message: "Cor criada com sucesso!" })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async addColorstock(req, res) {
        const productId = req.params.id
        const { stock, lojaId, sizeId, colorId } = req.body
        if (sizeId === 'undefined') {
            return res.status(422).json({ message: "Tamanho é obrigatório é obrigatório!" })
        }
        if (colorId === 'undefined') {
            return res.status(422).json({ message: "Cor é obrigatório!" })
        }
        if (lojaId === 'undefined') {
            return res.status(422).json({ message: "Loja é obrigatório!" })
        }
        if (stock === 'undefined') {
            return res.status(422).json({ message: "Stock é obrigatório!" })
        }
        try {
            const sizeColorExixts = await SizeColor.findOne({
                where: { sizeId, colorId }, raw: true
            })
            let sizeColorId = 0
            if (!sizeColorExixts) {
                await SizeColor.create({ sizeId, colorId })
                sizeColorId = await SizeColor.max('id')
            } else {
                sizeColorId = sizeColorExixts.id
            }
            const productSizeColorIdExists = await Product_size_color.findOne({
                where: { productId, sizeColorId }, raw: true
            })
            let productSizeColorId = 0
            if (!productSizeColorIdExists) {
                await Product_size_color.create({ productId, sizeColorId })
                productSizeColorId = await Product_size_color.max('id')
            } else {
                productSizeColorId = productSizeColorIdExists.id
            }

            if (typeof lojaId === 'string' || typeof lojaId === "number") {
                await Stock.create({ stock, lojaId, productSizeColorId })
            } else {
                await Promise.all(lojaId.map(async (loja, i) => {
                    await Stock.create({ stock: stock[i], lojaId: loja, productSizeColorId })
                }))
            }
            return res.status(200).json({
                message: 'Loja atualizada com sucesso!'
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: err })
        }
    }

    static async editProduct(req, res) {
        const id = req.params.id
        const { name, ref, price } = req.body
        const newProduct = await Product.findByPk(id, { raw: true })
        if (name) {
            newProduct.name = name
        } else {
            res.status(404).json({ message: "O nome é obrihgatório!" })
        }
        if (ref) {
            newProduct.ref = ref
        } else {
            res.status(404).json({ message: "a referencia é obrihgatório!" })
        }
        if (price) {
            newProduct.price = price
        } else {
            res.status(404).json({ message: "O preço é obrihgatório!" })
        }
        if (req.file) {
            fs.unlink(`./public/img/product/${newProduct.image}`, (err) => {
                if (err) throw err;
                console.log(`Arquivo ${newProduct.image} deletado!`);
            })
            newProduct.image = req.file.filename
        }
        try {
            await Product.update(newProduct, { where: { id } })
            return res.status(200).json({ message: "Produto atulaizado com sucesso!" })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async changeQty(req, res) {
        const { lojaId, id, productSizeColorId, stock } = req.body
        if (!req.body.stock) {
            return res.status(422).json({ message: "Informe a quatidade no estoque!" })
        }
        try {
            await Stock.update(
                { stock, lojaId, productSizeColorId }
                , { where: { id } })
            return res.status(200).json({
                message: 'Produto atualizado com sucesso!'
            })
        } catch (error) {
            return res.status(500).json({ message: error })
        }
    }

    static async delete(req, res) {
        const id = req.params.id
        try {
            const data = await Product_size_color.findOne({ where: { productId: id }, raw: true })
            await Product_size_color.destroy({ where: { productId: id } })
            await Stock.destroy({ where: { productSizeColorId: data.id } })
            await Product.destroy({ where: { id } })
            return res.status(200).json({ message: "Produto deletado com suceso!" })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
}
export default ProductController