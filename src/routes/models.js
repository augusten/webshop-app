'use strict'

/////////////////////////////////////////////////////////////////////////
//-------------------------- LOAD MODULES -------------------------------

// import  modules
const Sequelize = require ('sequelize')

/////////////////////////////////////////////////////////////////////////
//---------------------------- SET UP DATABASE --------------------------

// connect to database blog_app
let db = () => {
	return new Sequelize( process.env.WEBSHOP_DB, process.env.POSTGRES_USER , process.env.POSTGRES_PASSWORD, {
    	server: 'localhost',
    	dialect: 'postgres'
	})
}

// Define the models of the database
let user_buyer = ( db ) => {
	return db.define( 'user_buyer', {
		user_ID: {type: Sequelize.STRING, unique: true},
		firstname: {type: Sequelize.STRING, unique: true},
		lastname: {type: Sequelize.STRING, unique: true},
		email: {type: Sequelize.STRING, unique: true},
		phone: {type: Sequelize.STRING, unique: true},
		address: Sequelize.STRING
		password: Sequelize.STRING
	})
}

let user_seller = ( db ) => {
	return db.define( 'user_seller', {
		company_ID: {type: Sequelize.STRING, unique: true},
		company_name: {type: Sequelize.STRING, unique: true},
		email: {type: Sequelize.STRING, unique: true},
		phone: {type: Sequelize.STRING, unique: true},
		address: Sequelize.STRING
		password: Sequelize.STRING
	})
}

let order = ( db ) => {
	return db.define( 'order', {
		order_ID: {type: Sequelize.STRING, unique: true},
		order: Sequelize.JSON,
		user_ID: Sequelize.STRING,
		paid: Sequelize.STRING
	})
}

let product = ( db ) => {
	return db.define( 'product', {
		product_ID: {type: Sequelize.STRING, unique: true},
		name: Sequelize.STRING,
		company_ID: Sequelize.STRING,
		company_name: Sequelize.STRING,
		specifics: Sequelize.JSON
	})
}

let specifics = ( db ) => {
	return db.define( 'specifics', {
		feature: Sequelize.STRING,
		possibilities: Sequelize.ARRAY(Sequelize.STRING)
	})
}

// Add the connections between models
let connections = ( buyer, seller, order, product ) => {
	buyer.hasMany( order )
	seller.hasMany( order )
	seller.hasMany( product )
	order.belongsTo( buyer )
	order.belongsTo( seller )
	product.belongsTo( seller )
}

/////////////////////////////////////////////////////////////////////////
//---------------------------- MODEL EXPORTS ----------------------------

module.exports = {
	DB: db,
	Buyer: user_buyer,
	Seller: user_seller,
	Order: order,
	Product: product,
	Specifics: specifics, 
	Connections: connections
}
