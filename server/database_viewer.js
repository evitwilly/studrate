const sqlite = require('sqlite3').verbose();
const path = require('path');

const database_file_path = path.resolve(__dirname, 'database.db');
const database = new sqlite.Database(database_file_path);

// database.all("select * from students", function (err, data) {
// 	console.log(data);
// });

database.all("select * from groups", function (err, data) {
	console.log(data);
});

database.close()