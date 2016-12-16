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
let ProductSpecs = models.Productspecs( db )
models.Connections( Buyer, Seller, Order, Product, ProductSpecs )

/////////////////////////////////////////////////////////////////////////
//----------------------------- GET ROUTES ------------------------------

// route to index page
router.get('/', ( req, res ) => {
	res.render( 'index', {
		user: req.session.user
	} )
})

// route to register pager ( later to be a pop up window when the frontend is done )
router.get('/register', ( req, res ) => {
	res.render( 'register' )
})

router.get('/logout', (req, res) => {
	req.session.destroy( error => {
		if (error) {
			throw error;
		}
		res.redirect('/?message=' + encodeURIComponent("logged out"))
	})
})

/////////////////////////////////////////////////////////////////////////
//----------------------------- POST ROUTES ------------------------------

router.post( '/login', bodyParser.urlencoded({extended: true}), ( req,res ) => {
	if ( (req.body.email === undefined || req.body.password === undefined ) && ( req.body.companyEmail === undefined || req.body.companyPassword === undefined ) )  {
		// check if valid login information
		res.redirect( '/?message=' + encodeURIComponent( 'forgot to type in password or email' ))
	} else {
		if ( req.body.email && req.body.password ) {
			// login as buyer
			Buyer.findOne( {
				where: {
					email: req.body.email
				}
			})
			.then( buyer => {
				if ( buyer != null) {
					bcrypt.compare( req.body.password, buyer.dataValues.password, ( err, result ) => {
						if( result ) {
							req.session.user = buyer
							res.redirect( '/' )
						}
					})
				} else {
					res.redirect( '/?message=' + encodeURIComponent( "invalid email or passwors" ))
				}
			})
		} else {
			// login as seller
			Seller.findOne( {
				where: {
					email: req.body.companyEmail
				}
			})
			.then( seller => {
				bcrypt.compare( req.body.companyPassword, seller.dataValues.password, (err, result ) => {
					if ( result ) {
						req.session.user = seller
						res.redirect( '/' )
					}
				})
			})

		}
	}
})

router.post( '/register', bodyParser.urlencoded({extended: true}), ( req, res ) => {
	// some data validation
	if ( ( req.body.password !== req.body.repeatpassword ) || ( req.body.companyPassword !== req.body.companyRepeatPassword ) ) {
		res.redirect ('/register?message=' + encodeURIComponent( 'passwords do not match' ))
	} else {
		// if ( req.body.email ) {
		// 	// for buyer

		if ( req.body.email ) {
			if (req.body.password.length < 8) {
				res.redirect( '/register?message=' + encodeURIComponent( 'password too short' ))
			} else {
				// for buyer
					// register user if their email does not exist yet
				Buyer.count ( {
					where: { email: req.body.email }
				} )
				.then( num => {
					if ( num > 0 ) {
						res.redirect('/register?message=' + encodeURIComponent( "email already exists" ))
					} else {				
						bcrypt.hash(req.body.password, 8, ( err, hash ) => {
							if (err) throw err
								Buyer.create( {
									firstname: req.body.firstname,
									lastname: req.body.lastname,
									email: req.body.email,
									phone: req.body.phone,
									address: req.body.address,
									password: hash
								} )
							res.redirect( '/' )
						})
					}
				})
			}  
		} else {
			if (req.body.companyPassword.length < 8) {
				res.redirect( '/register?message=' + encodeURIComponent( 'password too short' ))
			} else {
			// for seller
				Seller.count ( {
					where: { email: req.body.companyEmail }
				} )
				.then ( num => {
					if ( num > 0 ) {
						res.redirect('/register?message=' + encodeURIComponent( "email already exists" ))
					} else {
						bcrypt.hash(req.body.companyPassword, 8, ( err, hash ) => {
							if (err) throw err
							console.log('ima here')
								Seller.create( {
									// company_ID: "22345678",
									company_name: req.body.companyName,
									email: req.body.companyEmail,
									phone: req.body.companyPhone,
									address: req.body.companyAddress,
									password: hash
								} )
							res.redirect( '/' )
						})						
					}
				})
			}

		}
	}
})


/////////////////////////////////////////////////////////////////////////
//------------------------------- EXPORT --------------------------------

module.exports = router
