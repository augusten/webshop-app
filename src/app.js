'use strict'

/////////////////////////////////////////////////////////////////////////
//-------------------------- LOAD MODULES -----------------------------

// import  modules
const Sequelize = require ('sequelize')
const express = require ('express')
const session = require ('express-session')
const bodyParser = require('body-parser')
const signin = require( __dirname + '/routes/signin')
const products = require( __dirname + '/routes/products')
const orders = require( __dirname + '/routes/orders')

// load database and express objects 
const app = express()

// set up the views engine
app.set('views', __dirname + '/../views')
app.set('view engine', 'pug')

/////////////////////////////////////////////////////////////////////////
//-------------------------- LOAD PUG FILES -----------------------------

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
//----------------------------- USE ROUTES ------------------------------
app.use('/', signin)
app.use('/', products)
app.use('/', orders)

/////////////////////////////////////////////////////////////////////////
//---------------------------- START SERVER -----------------------------
app.listen( 8000, () => {
    console.log( "Running on port 8000" )
})
