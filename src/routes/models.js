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
let buyer = ( db ) => {
	return db.define( 'buyer', {
		// buyer_ID: {type: Sequelize.STRING, unique: true},
		firstname: {type: Sequelize.STRING, unique: true},
		lastname: {type: Sequelize.STRING, unique: true},
		email: {type: Sequelize.STRING, unique: true},
		phone: {type: Sequelize.STRING, unique: true},
		address: Sequelize.STRING,
		password: Sequelize.STRING
		// role: Sequelize.STRING
	})
}

let seller = ( db ) => {
	return db.define( 'seller', {
		// company_ID: {type: Sequelize.STRING, unique: true},
		company_name: {type: Sequelize.STRING, unique: true},
		email: {type: Sequelize.STRING, unique: true},
		phone: {type: Sequelize.STRING, unique: true},
		address: Sequelize.STRING,
		password: Sequelize.STRING
		// role: Sequelize.STRING
	})
}

let order = ( db ) => {
	return db.define( 'order', {
		// order_ID: {type: Sequelize.STRING, unique: true},
		order: Sequelize.JSON,
		// user_ID: Sequelize.STRING,
		quantity: Sequelize.STRING,
		paid: Sequelize.STRING
	})
}

let product = ( db ) => {
	return db.define( 'product', {
		price: Sequelize.FLOAT,
		name: Sequelize.STRING
	})
}

let product_specs = ( db ) => {
	return db.define( 'productspec', {
		colors: Sequelize.ARRAY(Sequelize.STRING),
		materials: Sequelize.ARRAY(Sequelize.STRING)
	})
}

let specifics = ( db ) => {
	return db.define( 'specific', {
		feature: Sequelize.STRING,
		possibilities: Sequelize.ARRAY(Sequelize.STRING)
	})
}

// Add the connections between models
let connections = ( buyer, seller, order, product, specs ) => {
	buyer.hasMany( order )
	seller.hasMany( order )
	seller.hasMany( product )
	order.belongsTo( buyer )
	order.belongsTo( seller )
	product.belongsTo( seller )
	specs.belongsTo( product )
	product.hasOne( specs )
	// product.hasMany( specs )
}

/////////////////////////////////////////////////////////////////////////
//---------------------------- MODEL EXPORTS ----------------------------

module.exports = {
	DB: db,
	Buyer: buyer,
	Seller: seller,
	Order: order,
	Product: product,
	Specifics: specifics, 
	Productspecs: product_specs,
	Connections: connections
}
