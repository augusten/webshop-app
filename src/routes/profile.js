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

router.get( '/goprofile', ( req, res ) => {
	if ( !req.session.user ) {
		res.render( 'wrong' )
	} else {

		// find if role is user or admmin

		// console.log( req.session.user )
		Buyer.findOne({
			where: { id: req.session.user.id }
		}).then( buyer => {
			// console.log( buyer.dataValues )
			Order.findAll({
				where: {buyerId: req.session.user.id}
			}).then( orders => {
				// console.log( JSON.parse(orders[0].dataValues.order.product).name )
				res.render( 'profile', {
					user: req.session.user,
					orders: orders
				})
			})
		})
	}
})

/////////////////////////////////////////////////////////////////////////
//----------------------------- POST ROUTES -----------------------------

router.get( '/delete', bodyParser.urlencoded({extended: true}), ( req, res ) => {
	// console.log( req.query )

	// find order -> find user -> delete order
	Order.findOne({
		where: { id: req.query.id }
	}).then( order => {
		console.log( order )
		Buyer.findOne({
			where: { id: order.dataValues.buyerId }
		}).then( buyer => {
			Order.destroy({
				where: { id: req.query.id }
			}).then( () => {
				Order.findAll({
					where: { buyerId: buyer.dataValues.id}
				}).then( orders => {
					res.send({
						user: req.session.user,
						orders: orders,
						deletedOrderId: "entry" + req.query.id
					})
				})
			})
		})
	})
})

/////////////////////////////////////////////////////////////////////////
//----------------------------- EXPORT ROUTES ---------------------------

module.exports = router