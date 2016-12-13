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
models.Connections( Buyer, Seller, Order, Product )

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
				seller.createProduct({
					product_ID: '12345678',
					name: "Childish Gambino",
					// company_ID: "Sequelize.STRING",
					// company_name: Sequelize.STRING,
					specifics: {
						colors: ["red", "blue"], 
						materials: ["wood", "plastic", "paper"]
					}
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
		})
})

/////////////////////////////////////////////////////////////////////////
//----------------------------- GET ROUTES ------------------------------

router.get( '/products', ( req, res ) => {
	// Product.findAll({

	// })
	// .then( products => {

	// })
	let specifications = []
	Specifics.findAll()
	.then( specs => {
		for (var i = specs.length - 1; i >= 0; i--) {
			specifications.push( specs[i].dataValues )
		}
		return specifications // this may not be the most efficient way?? 
	})
	.then( specArray => {
		console.log( specArray )
		res.render( "products", {
			user: req.session.user,
			specifications: specArray
		})
	})
		// console.log( specs )
		// res.render( "products", {
		// 	user: req.session.user,
		// 	specifications: specs
		// })
})

/////////////////////////////////////////////////////////////////////////
//----------------------------- POST ROUTES -----------------------------

module.exports = router