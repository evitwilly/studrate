const express = require('express');
const sqlite = require('sqlite3').verbose();
const cors = require('cors')
const path = require('path');
const excel = require("exceljs");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

const port = 3434;

const database_file_path = path.resolve(__dirname, 'database.db');
const xls_path = path.resolve(__dirname, 'students.xlsx');
const database = new sqlite.Database(database_file_path);

function property(obj, key, defaultValue) {
	const value = obj[key];
	return value == undefined ? defaultValue : value;
}

function successMessage(message) {
	return {
		"status": "success",
		"result": null,
		"message": message
	};
}

function success(data) {
	return {
		"status": "success",
		"result": data,
		"message": ""
	};
}

function error(message) {
	return {
		"status": "error",
		"result": null,
		"message": message
	};
}

app.post("/groups/export", (req, res) => {
	console.log(req);
	const group = req.body.group;
	const students = req.body.students;
	console.log(students);
	if (students == undefined || students.length <= 0) {
		res.json(error("студентов нет"));
	} else {
		const workbook = new excel.Workbook();
		const worksheet = workbook.addWorksheet("студенты_" + group.name);

		worksheet.columns = [
		    { header: "номер", key: "number", width: 10 }, 
			{ header: "ФИО", key: "fio", width: 50 }, 
    		{ header: "балл", key: "rating", width: 10 }
		];

		let studentNumber = 1;
		students.forEach((student) => {
			student.number = studentNumber;
			worksheet.addRow(student);
			studentNumber++;
		});

		worksheet.getRow(1).eachCell((cell) => {
			cell.font = { bold: true };
		});

		workbook.xlsx.writeFile(xls_path).then(() => {
			res.download(xls_path, "students.xlsx");
		});
	}
});

app.get("/students", (req, res) => {
	database.all("select * from students",  (err, data) => {
		if (err != null && err != undefined) {
			console.log(err);
			res.json(error("возникла неизвестная проблема с базой данных"));
		} else {
			res.set("Access-Control-Allow-Origin", "*");
			res.json(success(data));
		}
	});
});


app.post("/students/remove", (req, res) => {
	const student = req.body;
	if (!("id" in student)) {
		res.json(error("не указан id студента"));
	} else {
		database.run("delete from students where id = ?", [ student.id], (err) => {
			if (err != null && err != undefined) {
				res.json(error("возникли проблемы при удалении студента из базы данных"));
			} else {
				res.json(successMessage("студент был успешно удален из базы данных!"));
			}
		});
	}
});

app.post("/students/add", (req, res) => {
	const student = req.body;
	if (!("fio" in student)) {
		res.json(error("не указана фамилия студента"));
	} else if (!("rating" in student)) {
		res.json(error("не указан балл студента"));
	} else if (!("priority_one" in student)) {
		res.json(error("не указана первая группа для студента"));
	} else {
		const fio = student["fio"];
		const rating = student["rating"];
		const priorityOne = student["priority_one"];
		const priorityTwo = property(student, "priority_two", -1);
		const priorityThree = property(student, "priority_three", -1);
		database.run("insert into students (fio, rating, priorityOne, priorityTwo, priorityThree) values (?, ?, ?, ?, ?)", [ fio, rating, priorityOne, priorityTwo, priorityThree ], (err) => {
			if (err != null && err != undefined) {
				res.json(error("возникли проблемы при добавлении студента в базу данных"));
			} else {
				res.json(successMessage("успешно добавлен студент"));
			}	
		});
	}
});


app.post("/student/update", (req, res) => {
	const student = req.body;
	if (!("id" in student)) {
		res.json(error("не указан id студента"));
	} else if (!("fio" in student)) {
		res.json(error("не указана фамилия студента"));
	} else if (!("rating" in student)) {
		res.json(error("не указан балл студента"));
	} else if (!("priority_one" in student)) {
		res.json(error("не указана первая группа для студента"));
	} else {
		const id = student["id"];
		const fio = student["fio"];
		const rating = student["rating"];
		const priorityOne = student["priority_one"];
		const priorityTwo = property(student, "priority_two", -1);
		const priorityThree = property(student, "priority_three", -1);
		database.run("update students set fio = ?, rating = ?, priorityOne = ?, priorityTwo = ?, priorityThree = ? where id = ?", [ fio, rating, priorityOne, priorityTwo, priorityThree, id ], (err) => {
			if (err != null && err != undefined) {
				res.json(error("возникли проблемы при добавлении студента в базу данных"));
			} else {
				res.json(successMessage("успешно добавлен студент"));
			}	
		});
	}
});


app.get("/groups", (req, res) => {
	database.all("select * from groups", (err, data) => {
		if (err != null && err != undefined) {
			console.log(err);
			res.json(error("возникла неизвестная проблема с базой данных"));
		} else {
			res.json(success(data));
		}
	});
});

app.post("/groups/add", (req, res) => {
	const group = req.body;
	if (!("name" in group)) {
		res.json(error("не указано название группы"));
	} else {
		const name = group["name"];
		database.run("insert into groups (name) values (?)", [ name ], (err) => {
			if (err != null && err != undefined) {
				res.json(error("возникли проблемы при добавлении группы в базу данных"))
			} else {
				res.json(successMessage("успешно добавлена группа"))
			}
		})
	}
});

app.post("/groups/remove", (req, res) => {
	const group = req.body;
	if (!("id" in group)) {
		res.json(error("не указан id группы, которую вам нужно удалить"));
	} else {
		const id = group["id"];
		database.run("delete from groups where id = (?)", [ id ], (err) => {
			if (err != null && err != undefined) {
				res.json(error("возникли проблемы при удалении группы из базы данных"))
			} else {
				res.json(successMessage("успешно удалена группа"))
			}
		})
	}
});

app.post("/groups/updateName", (req, res) => {
	const group = req.body;
	if (!("name" in group)) {
		res.json(error("не указано название группы"));
	} else if (!("id" in group)) {
		res.json(error("не указан id группы"));
	} else {
		database.run("update groups set name = ? where id = ?", [ group.name, group.id ], (err) => {
			if (err != null && err != undefined) {
				res.json(error("возникли проблемы при обновлении группы в базе данных"));
			} else {
				res.json(successMessage("название группы было успешно обновлено"));
			}
		});
	}
});

app.listen(port, () => console.log(`studrate app listenning on port ${port}`));

process.on('exit', () => database.close());
process.on('SIGINT', () => database.close());
