const sqlite = require('sqlite3').verbose();
const path = require('path');

const database_file_path = path.resolve(__dirname, 'database.db');
const database = new sqlite.Database(database_file_path);

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

const groupNames = [
	"КСК-19", "АМ-19", "МЭП-19"
];

database.serialize(() => {
	database.run("delete from groups");
	database.run("delete from students");

	groupNames.forEach((groupName) => {
		database.run("insert into groups (name) values (?)", [ groupName ]);
	});	

	database.all("select * from groups", (err, data) => {
		for (let i = 0; i < 60; i++) {
			const firstName = firstNames[Math.round(Math.random() * firstNames.length - 1)];
			const lastName = lastNames[Math.round(Math.random() * lastNames.length - 1)];

			const groups = [].concat(data);
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

			const student = [
				lastName + " " + firstName, 
				Math.random() * 2 + 3, 
				priorityOne, 
				priorityTwo, 
				priorityThree
			];
			database.run("insert into students (fio, rating, priorityOne, priorityTwo, priorityThree) values (?, ?, ?, ?, ?)", student);
		}
	});	
});


