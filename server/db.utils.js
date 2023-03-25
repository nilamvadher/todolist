
const sqlite3 = require('sqlite3').verbose();

function openDB() {
	const db = new sqlite3.Database('./server/todolistdb.db');
	return db;
}

function closeDB(db) {
	db.close();
}

function setupDB(db) {
	// try {
	db.run('CREATE TABLE todolists (id INTEGER, name TEXT, created_at DATETIME, PRIMARY KEY(id))', function (err) {
		if (err) {
			console.log("in todolist table creation");
		}

	});
	db.run('CREATE TABLE items (id INTEGER, description TEXT, PRIMARY KEY(id))', function (err) {
		if (err)
			console.log("in items table creation");
	});
	db.run('CREATE TABLE todolist_item (todolist_id INTEGER, item_id , PRIMARY KEY(todolist_id,item_id))', function (err) {
		if (err) console.log("in todolist_item table creation");
	});
	db.run('CREATE TABLE users (user_id TEXT, token TEXT, password TEXT, PRIMARY KEY(user_id))', function (err) {
		if (err) console.log("in users table creation");
	});
	db.run('CREATE TABLE user_todolist (user_id TEXT, todolist_id INTEGER , PRIMARY KEY(user_id,todolist_id))', function (err) {
		if (err) console.log("in user_todolist table creation");
	});
}

const checkUser =  (userId, password, db) => {

	let query = "select * from users where user_id = ? and password = ?"
	let params = [userId, password]

	return new Promise((resolve, reject) => {
		db.all(query, params, async function (err, rows) {
			if (err) {
				reject(err);
			}
			else {
				if (rows.length !== 1) {
					reject(new Error('No match found'))
				} else {
					
					const short = require('short-uuid');
					const token = short.generate();

					//update token in db
					let updateQuery = "update users set token=? where user_id=? and password=?"
					let updateParam = [token, userId, password]
					
					const updatePromise = new Promise((resolve1, reject1) => {
						db.all(updateQuery, updateParam, function (errInUpdate, rowsInUpdate) {
							if (errInUpdate) reject1(errInUpdate)
							else resolve1(true)
						})
					})
					const result = await updatePromise;
					if (result === true) {
						resolve(token);
					}
					else {
						reject(new Error('update failed'))						
					}
					
				}
			}
		})
	})
	
}

module.exports.checkUser = checkUser;
module.exports.setupDB = setupDB
module.exports.openDB = openDB
module.exports.closeDB = closeDB
