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

// sync database
db.sync( {force: true} )
.then( db => {
	console.log( 'now synced' )

	// Create demo users
	bcrypt.hash( 'aaaa', 8, ( err, hash ) => {
		if (err) throw err
			Buyer.create( {
				user_ID: '1111',
				name: "Name",
				email: "email@original.nl",
				password: "aaaa"
			} )
		.then( buyer => {
			buyer.createOrder( {
				order_ID: '1234678',
				order: {
					red :"#f00",
					"green":"#0f0",
					"blue":"#00f",
					"cyan":"#0ff",
					"magenta":"#f0f",
					"yellow":"#ff0",
					"black":"#000"
				},
				user_ID: '1234',
				paid: 'no'
			})
		})
	})
})

/////////////////////////////////////////////////////////////////////////
//----------------------------- GET ROUTES ------------------------------

// test route
router.get('/ping', ( req, res ) => {
	res.send( 'pong' )
})

// route to index page
router.get('/', ( req, res ) => {
	res.render( 'index', {
		user: req.session.user
	} )
})

router.get('/register', ( req, res ) => {
	res.render( 'register' )
})

/////////////////////////////////////////////////////////////////////////
//----------------------------- POST ROUTES ------------------------------

router.post( '/login', bodyParser.urlencoded({extended: true}), ( req,res ) => {
	if ( req.body.email.length === 0 || req.body.password.length ===0 ) {
		res.redirect( '/message=' + encodeURIComponent( 'forgot to type in password or email' ))
	} else {
		Buyer.findOne( {
			where: {
				email: req.body.email
			}
		})
		.then( buyer => {
			if ( buyer != null) {
				bcrypt.compare( req.body.password, user.dataValues.password, ( err, result ) => {
					if( result ) {
						req.session.user = user
						res.redirect( '/' )
					}
				})
			}
		})
	}
})


/////////////////////////////////////////////////////////////////////////
//------------------------------- EXPORT --------------------------------

module.exports = router
