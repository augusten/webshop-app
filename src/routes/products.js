'use strict'

/////////////////////////////////////////////////////////////////////////
//-------------------------- LOAD MODULES -------------------------------

// import  modules
const Sequelize = require ('sequelize')
const express = require ('express')
const session = require ('express-session')
const bodyParser = require('body-parser')
const models = require( __dirname + '/models')
const bcrypt = require( 'bcrypt' )

// load express objects
const router = express.Router()
const app = express()

// For logged in user start session
app.use(
	express.static( __dirname + '/../static' ),
	session ({
		secret: 'this is some secret',
		resave: true,
		saveUninitialized: true,
		cookie: {
			secure: false,
			maxage: 3600
		}
	})
)

/////////////////////////////////////////////////////////////////////////
//--------------------------- LOAD DATABASE -----------------------------

let db = models.DB()
let Buyer = models.Buyer( db )
let Seller = models.Seller( db )
let Order = models.Order( db )
let Product = models.Product( db )
let Specifics = models.Specifics( db )
let Productspec = models.Productspecs( db )
models.Connections( Buyer, Seller, Order, Product, Productspec )

/////////////////////////////////////////////////////////////////////////
//----------------------------- GET ROUTES ------------------------------

router.get( '/products', ( req, res ) => {
	let specifications = []
	Specifics.findAll()
	.then( specs => {
		for (var i = specs.length - 1; i >= 0; i--) {
			specifications.push( specs[i].dataValues )
		}
		return specifications // this may not be the most efficient way?? 
	})
	.then( specArray => {
		res.render( "products", {
			user: req.session.user,
			specifications: specArray
		})
	})
})

router.get ( '/showproducts', ( req, res ) => {
	// console.log( req.query )
	let products = []
	let Results = []
	Productspec.findAll({
		where: {
			colors: { $contains: [req.query.color] },
			materials: { $contains: [req. query.material] }
		},
		attributes: ["productId"]
	}).then ( specifics => {
		for (var i = specifics.length - 1; i >= 0; i--) {
			products.push( specifics[i].dataValues.productId )//.dataValues.ProductId )
		}
		return products
		// console.log( specifics )
	}).then( productIds => {
		Product.findAll({
			where: { 
				id: { $in: productIds }
			}
		}).then( results => {
			for (var j = results.length - 1; j >= 0; j--) {
				Results.push( results[j].dataValues )
				// console.log( results[j].dataValues )
			}
			res.send( Results )
		})
	})
})

router.get( '/product', ( req, res ) => {
	// console.log( req.query )
	Product.findOne({
		where: { id: req.query.id }
	}).then( product => {
		Productspec.findOne({
			where: { productId: req.query.id}
		}).then( specifics => {
			res.render( 'product', {
				user: req.session.user,
				product: product,
				specifics: specifics
			})
		})
	})
})

router.get( '/thanks', ( req, res ) => {
	res.render( 'thanks', {
		user: req.session.user
	})
})

/////////////////////////////////////////////////////////////////////////
//----------------------------- POST ROUTES -----------------------------

/////////////////////////////////////////////////////////////////////////
//----------------------------- EXPORT ROUTES ---------------------------

module.exports = router


// SYNC DB FOR DEVELOPMENT
db.sync({ force: true }).then( db => {
	bcrypt.hash( '12345678', 8, ( err, hash ) => {
		if (err) throw err
			Seller.create( {
				company_ID: "12345678",
				company_name: "Sarvas",
				email: "sarvas@yo.lt",
				phone: "12345678",
				address: "ateities g",
				password: hash
			} ).then( seller => {
				seller.createProduct( { 
					price: "2400.00",
					name: "Childish Gambino",
				}).then( product => {
					// console.log( product )
					product.createProductspec({
						colors: ["red", "blue"], 
						materials: ["wood", "plastic", "paper"]
					})
				})
			})
	})
	bcrypt.hash( '12345678', 8, ( err, hash ) => {
		if (err) throw err
			Seller.create( {
				company_ID: "678678678",
				company_name: "asd",
				email: "kol@yo.lt",
				phone: "0979",
				address: "geliu g",
				password: hash
			} ).then( seller => {
				seller.createProduct( {
					price: "24.99",
					name: "Product #smth",
				}).then( product => {
					// console.log( product )
					product.createProductspec({
						colors: ["red", "blue"], 
						materials: ["wood", "plastic", "paper"]
					})
				})
			})
	})

	bcrypt.hash( '12345678', 8, ( err, hash ) => {
		if (err) throw err
			Seller.create( {
				company_ID: "0987987",
				company_name: "qwertty",
				email: "kol@yoyo.lt",
				phone: "087908543",
				address: "rugiu g",
				password: hash
			} ).then( seller => {
				seller.createProduct( { 
					price: "100.00",
					name: "#smth",
				}).then( product => {
					// console.log( product )
					product.createProductspec({
						colors: ["red", "blue"], 
						materials: ["wood", "plastic", "paper"]
					})
				})
			})
	})

	bcrypt.hash( '87654321', 8, ( err, hash ) => {
		if (err) throw err
			Seller.create( {
				company_ID: "876321",
				company_name: "#2",
				email: "this@yo.lt",
				phone: "88888888",
				address: "some gatve",
				password: hash
			} ).then( seller => {
				seller.createProduct( { 
					price: "1234.89",
					name: "Train",
				}).then( product => {
					// console.log( product )
					product.createProductspec({
						colors: ["black", "blue"], 
						materials: ["wood"]
					})
				})
			})
	})

	bcrypt.hash( '67676767', 8, ( err, hash ) => {
		if (err) throw err
			Seller.create( {
				company_ID: "45454545",
				company_name: "#3 jess",
				email: "this@not.me",
				phone: "23232323",
				address: "our street",
				password: hash
			} ).then( seller => {
				seller.createProduct( { 
					price: "6767.00",
					name: "Train",
				}).then( product => {
					// console.log( product )
					product.createProductspec({
						colors: ["brown"], 
						materials: ["plastic"]
					})
				})
			})
	})
	
	Specifics.create( {
		feature: "colors",
		possibilities: ["red", "blue", "black", "brown"]
	})
	Specifics.create( {
		feature: "materials",
		possibilities: ["wood", "plastic", "metal", "amber", "oak", "paper"]
	})

	// Order.create({
	// 	// order_ID: {type: Sequelize.STRING, unique: true},
	// 	order: Sequelize.JSON,
	// 	user_ID: Sequelize.STRING,
	// 	quantity: Sequelize.INTEGER,
	// 	paid: Sequelize.STRING
	// })
})