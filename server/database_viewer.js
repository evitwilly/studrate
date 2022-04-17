const sqlite = require('sqlite3').verbose();
const path = require('path');

const database_file_path = path.resolve(__dirname, 'database.db');
const database = new sqlite.Database(database_file_path);
const excel = require("exceljs");

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

database.all("select * from students", (err, students) => {
	students.forEach((student) => {
		console.log(student.priorityOne + " : " + student.priorityTwo + " : " + student.priorityThree);

	});
});

database.all("select * from groups", (err, groups) => {
	groups.forEach((group) => {
		console.log(group.id);
	});
});

	// const workbook = new excel.Workbook(); 
 //  	workbook.xlsx.readFile('./static/students.xlsx').then(() => {
  	
 //  		const year = (new Date()).getFullYear();

 //  		database.all("select * from groups", (err, groups) => {
  			
 //  			let currentGroupId = groups[groups.length - 1].id;
  			
 //  			database.serialize(() => {
  				
 //  				workbook.worksheets.forEach((sheet) => {
	// 	  			sheet.eachRow({}, (row, number) => {
		  				
	// 	    			if (number >= 3) {
	// 	    				const fio = row.values[3];
	// 	    				const rating = row.values[4];

	// 	    				const hasOriginalDocs = row.values[5].toLowerCase() == "оригинал" ? 1 : 0;
	// 	    				const apartaments = (row.values[6] != undefined && row.values[6] != null 
	// 	    					&& row.values[6].toLowerCase() == "да") ? "Нуждается в общежитии" : "Не требуется";
		    			
	// 	    				const firstGroup = row.values[7];
	// 	    				const secondGroup = row.values[8];
	// 	    				const thirdGroup = row.values[9];

	// 	    				const foundedFirstGroup = groups.find((group) => group.name.toLowerCase().indexOf(firstGroup.trim().toLowerCase()) == 0);
	// 	    				let priorityOne = -1;
	// 	    				if (foundedFirstGroup == undefined || foundedFirstGroup == null) {
	// 	    					database.run("insert into groups (name) values (?)", [ `${firstGroup.trim()}-${year}` ]);	    					
	// 	    					priorityOne = currentGroupId + 1;
	// 	    					currentGroupId++;
	// 	    				} else {
	// 	    					priorityOne = foundedFirstGroup.id;
	// 	    				}

	// 	    				let priorityTwo = -1;
	// 	    				if (secondGroup != undefined && secondGroup != null && secondGroup.trim().length >= 2) {
	// 	    					const foundedSecondGroup = groups.find((group) => group.name.toLowerCase().indexOf(secondGroup.trim().toLowerCase()) == 0);
	// 							if (foundedSecondGroup == undefined || foundedSecondGroup == null) {
	// 								database.run("insert into groups (name) values (?)", [ `${secondGroup.trim()}-${year}` ]);
	// 								priorityTwo = currentGroupId + 1;
	// 								currentGroupId++;
	// 							} else {
	// 								priorityTwo = foundedSecondGroup.id;
	// 							}
	// 	    				}

	// 	    				let priorityThree = -1;

	// 	    				if (thirdGroup != undefined && thirdGroup != null && thirdGroup.trim().length >= 2) {
	// 	    					const foundedThirdGroup = groups.find((group) => group.name.toLowerCase().indexOf(thirdGroup.trim().toLowerCase()) == 0);
	// 							if (foundedThirdGroup == undefined || foundedThirdGroup == null) {
	// 								database.run("insert into groups (name) values (?)", [ `${thirdGroup.trim()}-${year}` ]);
	// 								priorityThree = currentGroupId + 1;
	// 								currentGroupId++;
	// 							} else {
	// 								priorityThree = foundedThirdGroup.id;
	// 							}
	// 	    				}

	// 	    				const student = [ fio, parseFloat(rating), priorityOne, priorityTwo, priorityThree, "", 0, -1, "", "", "", "Не указано", "", "", "", "", 0, 1, hasOriginalDocs, 0, "Не указано", "Не указано", "Не указано", "", "", "", apartaments ];

	// 						const sql = "insert into students (fio, rating, priorityOne, priorityTwo, priorityThree, birthDate, isFemale, professionId, documentSubmissionDate, snils, locality, documentType, documentSeria, documentNumber, documentIssueDate, documentGiver, isLimitedOpports, hasMedicine, hasOriginalDocs, isInternationalContract, educationLevel, educationType, educationFinancials, residentialAddress, registrationAddress, birthPlace, apartaments) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	// 						database.run(sql, student);
	// 	    			}
		    	
	// 	    		});
 //  				});
  				
  				
 //  			});
 //  		});

 //  	}); 