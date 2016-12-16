'use strict'

const express = require ('express')
const session = require ('express-session')
const bodyParser = require('body-parser')
const models = require( __dirname + '/models')

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
//------------------------------- GET ROUTES ----------------------------

// for now render empty pages
router.get( '/companies', ( req, res ) => {
	res.render( 'partners', {
		user: req.session.user
	} )
})

router.get( '/about', ( req, res ) => {
	res.render( 'partners', {
		user: req.session.user
	})
})

module.exports = router