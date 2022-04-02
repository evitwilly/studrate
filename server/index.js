const express = require('express');
const sqlite = require('sqlite3').verbose();
const cors = require('cors')
const path = require('path');
const excel = require("exceljs");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/static", express.static(path.join(__dirname, 'static')));

const port = 3434;

const database_file_path = path.resolve(__dirname, 'database.db');
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

const firstNames = [
	"Вадим", "Валентин", "Валерий", "Василий", "Вениамин", "Евгений", "Евдоким", "Егор", "Захар", "Зиновий", 
	"Тимофей", "Тихон", "Тарас", "Самсон", "Себастьян", "Дмитрий", "Ярослав", "Владимир", "Максим", "Петр",
	"Александр", "Борис", "Виталий", "Владислав", "Вячеслав", "Глеб", "Григорий", "Давид", "Денис", "Кирилл",
	"Илья", "Константин", "Кузьма", "Лавр", "Макар", "Никита", "Олег", "Порфирий", "Рюрик", "Семён", "Соломон"
];


const lastNames = [
	"Смирнов", "Иванов", "Кузнецов", "Соколов", "Попов", "Лебедев", "Козлов", "Новиков", "Морозов", "Петров", "Волков",
	"Соловьёв", "Васильев", "Зайцев", "Павлов", "Семёнов", "Голубев", "Виноградов", "Богданов", "Воробьёв", "Фёдоров", "Михайлов",
	"Беляев", "Тарасов", "Белов", "Комаров", "Орлов", "Киселёв", "Макаров", "Андреев", "Ковалёв", "Ильин", "Гусев", "Титов", "Кузьмин",
	"Кудрявцев", "Баранов", "Куликов", "Алексеев", "Степанов", "Яковлев", "Сорокин", "Сергеев", "Романов", "Захаров", "Борисов",
	"Королёв", "Герасимов", "Пономарёв", "Григорьев"
];


app.post("/test/generate", (req, res) => {
	const student_count = req.body.student_count;
	database.serialize(() => {

		database.run("delete from students");

		database.all("select * from groups", (err, data) => {

			database.serialize(() => {
				for (let i = 0; i < student_count; i++) {
					const firstName = firstNames[Math.round(Math.random() * firstNames.length - 1)];
					const lastName = lastNames[Math.round(Math.random() * lastNames.length - 1)];

					const groups = [].concat(data.slice(0, 3));
					let index = Math.round(Math.random() * 2);
					const priorityOne = groups[index].id;
					groups.splice(index, 1);

					const isPriorityTwo = Math.round(Math.random());

					let priorityTwo = -1;
					let priorityThree = -1;

					if (isPriorityTwo == 1) {
						index = Math.round(Math.random());
						priorityTwo = groups[index].id; 

						groups.splice(index, 1);

						const isPriorityThree = Math.round(Math.random());
						if (isPriorityThree == 1) {
							priorityThree = groups.pop().id;
						}
					}

					const rating = Math.round((Math.random() * 2 + 3) * 100) / 100;

					const student = [
						lastName + " " + firstName, 
						rating, 
						priorityOne, 
						priorityTwo, 
						priorityThree
					];
					if (i == student_count - 1)
						database.run("insert into students (fio, rating, priorityOne, priorityTwo, priorityThree) values (?, ?, ?, ?, ?)", student, (err) => {
							res.json(success("успешно сгенерированы тестовые данные!"));
						});
					else
						database.run("insert into students (fio, rating, priorityOne, priorityTwo, priorityThree) values (?, ?, ?, ?, ?)", student);
				}
			});
		});	
	});

});

app.post("/test/remove", (req, res) => {
	database.run("delete from students", (err) => {
		res.json(success("успешно удалены все записи из БД"));
	});
});



app.post("/groups/export", (req, res) => {
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


		const filenames = fs.readdirSync(path.resolve(__dirname, 'static'));
		filenames.forEach((file) => {
			fs.unlinkSync(path.resolve(__dirname, 'static/' + file));
		});

		const xls_path = path.resolve(__dirname, `static/${group.name}.xlsx`);

		workbook.xlsx.writeFile(xls_path).then(() => {
			res.json(success(`http://localhost:3434/static/${group.name}.xlsx`));
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


app.post("/students/update", (req, res) => {
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

app.get("/professions", (req, res) => {
	database.all("select * from professions", (err, data) => {
		if (err != null && err != undefined) {
			console.log(err);
			res.json(error("возникла неизвестная проблема с базой данных"));
		} else {
			res.json(success(data));
		}
	});
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

app.post("/groups/update", (req, res) => {
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
