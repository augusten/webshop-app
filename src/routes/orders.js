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
//------------------------------- GET ROUTES ----------------------------

router.get( '/profile', ( req, res ) => {

	// find if role is user or admmin
	
	res.render( 'profile', {
		user: req.session.user
	})
} )

router.get( '/addtocart', ( req, res ) => {
	if ( !req.session.user ) {
		res.send( 'wrong' )
	} else {
		Product.findOne({
			where: { name: req.query.name }
				// price: parseFloat( req.query.price ),
				// name: req.query.name
			}).then( product => {
				Order.create({
					order: {
						product: JSON.stringify( product ),
						productSpecs: JSON.stringify( { "color": req.query.color, "material": req.query.material } )
					},
					quantity: req.query.quantity,
					paid: req.query.paid
				}).then( order => {
					Buyer.findOne({ 
						where: {id: req.session.user.id}
					}).then( buyer => {
						order.setBuyer( buyer )
						res.send( order )
					})
				})
			})
		}
})

router.get('/wrong', (req, res) => {
	res.render ( 'wrong' )
})

/////////////////////////////////////////////////////////////////////////
//------------------------------ POST ROUTES ----------------------------

/////////////////////////////////////////////////////////////////////////
//----------------------------- EXPORT ROUTES ---------------------------

module.exports = router

