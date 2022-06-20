const sqlite = require('sqlite3').verbose();
const path = require('path');

const database_file_path = path.resolve(__dirname, 'database.db');
const database = new sqlite.Database(database_file_path);

database.run("alter table students add certificateNumber varchar(30)", function(error) {
	console.log("done!")
});