const express = require('express');
const sqlite = require('sqlite3').verbose();
const cors = require('cors')
const path = require('path');
const fileUpload = require('express-fileupload');
const excel = require("exceljs");
const fs = require("fs");
const iconv = require('iconv-lite');

const app = express();
app.use("/static", express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, "../studrate/build")));
app.use(express.json());
app.use(cors());
app.use(fileUpload());


const BASE_URL = "http://localhost:3434"

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

// students rating

function addToStudentArray(students, student) {
    if (students == undefined || students == null) return;
    if (students.length == 0) {
        students.push(student);
        return;   
    }
    var studentIndex = -1;
    for (var i = 0; i < students.length; i++) {
        if (students[i].id == student.id) {
            studentIndex = i;
            break;
        }
    }
    if (studentIndex == -1) {
        for (var i = 0; i < students.length; i++) {
            if (student.rating > students[i].rating) {
                if (i == 0) {
                    students.splice(0, 0, student);
                    break;
                } else {
                    students.splice(i, 0, student);
                    break;
                }
            } else if (i == students.length - 1) {
                students.push(student);
                break;
            }
        }
    }
}

function removeFromStudentArray(students, student) {
  if (students == undefined || students == null) return;
  for (var i = 0; i < students.length; i++) {
    if (students[i].id == student.id) {
        students.splice(i, 1);
        break;
    }
  }
}


function isNotValue(students) {
    return students == undefined || students == null;
}

function reorderGroups(
	student, 
	students,
	studentCount,
	totalStudents,
	otherStudents1,
	otherStudents2,
	isLast
) {
	if (students.length >= studentCount) {
		var lastStudent = students[studentCount - 1];
		var lastStudentRating = lastStudent.rating;
		if (student.rating <= lastStudentRating) {
			if ((isLast == true && isNotValue(otherStudents2)) || 
			(isNotValue(otherStudents1) && isNotValue(otherStudents2))) {
			    addToStudentArray(students, student);
				removeFromStudentArray(otherStudents1, student);
				removeFromStudentArray(otherStudents2, student);
			} else return false;
		} else {
		    
			totalStudents.push(lastStudent);

			addToStudentArray(students, student);
			removeFromStudentArray(otherStudents1, student);
			removeFromStudentArray(otherStudents2, student);

 
            removeFromStudentArray(totalStudents, student);
		}
	} else {
	    addToStudentArray(students, student);
	    removeFromStudentArray(otherStudents1, student);
	    removeFromStudentArray(otherStudents2, student);
	}
	return true;
}

function ratedStudents(groups, students) {
    var studentsByGroup = {};
    students.forEach(function (student) {
		if (studentsByGroup[student.priorityOne] == undefined) {
			studentsByGroup[student.priorityOne] = [];
		}
		if (student.priorityTwo != -1 && studentsByGroup[student.priorityTwo]) {
			studentsByGroup[student.priorityTwo] = [];
		}
		if (student.priorityThree != -1 && studentsByGroup[student.priorityThree]) {
			studentsByGroup[student.priorityThree] = [];
		}
		addToStudentArray(studentsByGroup[student.priorityOne], student);	
	});	
	var studentsQueue = [].concat(students);
	while (studentsQueue.length > 0) {
		var student = studentsQueue.shift();
		var isFirstGroupReordered = reorderGroups(
			student, 
			studentsByGroup[student.priorityOne],
			groups.find((group) => group.id == student.priorityOne).count,
			studentsQueue, 
			studentsByGroup[student.priorityTwo],
			studentsByGroup[student.priorityThree]
		);
		if (!isFirstGroupReordered && studentsByGroup[student.priorityTwo] != undefined) {
			var isSecondGroupReordered = reorderGroups(
				student, 
				studentsByGroup[student.priorityTwo],
				groups.find((group) => group.id == student.priorityTwo).count,
				studentsQueue, 
				studentsByGroup[student.priorityOne],
				studentsByGroup[student.priorityThree],
				true
			);
			if (!isSecondGroupReordered && studentsByGroup[student.priorityThree] != undefined) {
				reorderGroups(
					student, 
					studentsByGroup[student.priorityThree],
					groups.find((group) => group.id == student.priorityThree).count,
					studentsQueue, 
					studentsByGroup[student.priorityOne],
					studentsByGroup[student.priorityTwo]
				);
			}
		}
	}
	return studentsByGroup;
}

// =======================================================

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

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../studrate/build/index.html"));
});

/**=================================================
============== STUDENT API METHODS =================
===================================================*/

app.post("/students/generate", (req, res) => {
	const body = req.body;
	const groupCount = body.groupCount;
	const studentCount = body.studentCount;
	const isTwoGroup = body.isTwoGroup;
	const isThreeGroup = body.isThreeGroup;
	
	database.serialize(() => {

		database.run("delete from students");

		database.all("select * from groups", (err, data) => {

			database.serialize(() => {
				for (let i = 0; i < studentCount; i++) {
					const firstName = firstNames[Math.round(Math.random() * firstNames.length - 1)];
					const lastName = lastNames[Math.round(Math.random() * lastNames.length - 1)];

					const groups = [].concat(data.slice(0, groupCount));
					let index = Math.round(Math.random() * (groups.length - 1));
					const priorityOne = groups[index].id;
					groups.splice(index, 1);

					let priorityTwo = -1;
					let priorityThree = -1;

					if (isTwoGroup) {
						index = Math.round(Math.random() * (groups.length - 1));
						priorityTwo = groups[index].id; 

						groups.splice(index, 1);

						if (isThreeGroup) {
							priorityThree = groups.pop().id;
						}
					}

					const rating = Math.round((Math.random() * 2 + 3) * 100) / 100;

					const student = [
						lastName + " " + firstName, 
						rating, 
						priorityOne, 
						priorityTwo, 
						priorityThree,
						"23.01.2001",
						0, "05.04.2022", "", "", "Паспорт РФ",
						"0409", 
						"145339", 
						"09.09.2021",
						"отдел УФМС по Алтайскому краю в г. Рубцовске",
						0, 1, 1, 0, "Основное общее образование", 
						"Очное", 
						"За счет бюджета субъекта РФ",
						"пр. Ленина, 16", 
						"пр. Ленина, 16", 
						"Россия, Алтайский край, г. Рубцовск", "Не указано", "", ""

					];
					const sql = "insert into students (fio, rating, priorityOne, priorityTwo, priorityThree, birthDate, isFemale, documentSubmissionDate, snils, locality, documentType, documentSeria, documentNumber, documentIssueDate, documentGiver, isLimitedOpports, hasMedicine, hasOriginalDocs, isInternationalContract, educationLevel, educationType, educationFinancials, residentialAddress, registrationAddress, birthPlace, apartaments, prevEducationDate, prevEducationOrg) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
					if (i == studentCount - 1)
						database.run(sql, student, (err) => {
							res.json(success("успешно сгенерированы тестовые данные!"));
						});
					else database.run(sql, student);
				}
			});
		});	
	});

});

app.post("/students/statistics/export", (req, res) => {
	
	database.all("select * from groups", (err, groups) => {
		if (err != null || err != undefined) {
			res.json(error("возникла неизвестная проблема с базой данных"));
		} else {
			database.all("select * from students", (err, dbStudents) => {
				if (err != null && err != undefined) {
					res.json(error("возникла неизвестная проблема с базой данных"));
				} else {
					const students = ratedStudents(groups, dbStudents);
					
					const workbook = new excel.Workbook();
					const worksheet = workbook.addWorksheet("кол-во поданных заявлений");

					const columns = [];

					columns.push({ header: "Номер", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, key: "number", width: 10 });
					columns.push({ header: "Группа", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, key: "groupName", width: 23 });
					columns.push({ header: "Кол-во поданных заявлений", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, key: "count", width: 40 });
					columns.push({ header: "Максимальное кол-во заявлений", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, key: "maxCount", width: 46 });
					columns.push({ header: "Процент проходимости", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, key: "percent", width: 30 });

					worksheet.columns = columns;

					let number = 1;

					groups.forEach((group) => {
						const count = students[group.id] == undefined ? 0 : students[group.id].length;
						const maxCount = group.count;

						const stat = {
							number: number,
							groupName: group.name,
							count: count,
							maxCount: maxCount,
							percent: Math.round(count / maxCount * 100) + "%"
						};
						worksheet.addRow(stat);

						number += 1;
					});

					worksheet.getRow(1).eachCell((cell) => {
						cell.font = { bold: true };
					});

					console.log(worksheet);

					const filenames = fs.readdirSync(path.resolve(__dirname, 'static'));
					filenames.forEach((file) => fs.unlinkSync(path.resolve(__dirname, 'static/' + file)));

					const filename = "статистика_поданных_заявлений"
					const xls_path = path.resolve(__dirname, `static/${filename}.xlsx`);
					workbook.xlsx.writeFile(xls_path).then(() => {
						res.json(success(`${BASE_URL}/static/${filename}.xlsx`));
					});
				}
			})
		}
	});
});

app.post("/students/export", (req, res) => {
	const params = req.body;

	const type = params.type;
	const group = params.group;
	const students = params.students;
	const professions = params.professions;

	if (students == undefined || students.length <= 0) {
		res.json(error("студентов нет"));
	} else {
		const workbook = new excel.Workbook();
		const worksheet = workbook.addWorksheet("студенты_" + group.name);

		const columns = [];

		if (type == "xls") {
			columns.push({ header: "Номер", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, key: "number", width: 10 });
			if (params.isFio) columns.push({ header: "ФИО", key: "fio", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, width: 40 });
			if (params.isRating) columns.push({ header: "Средний балл", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, key: "rating", width: 25 });
			if (params.isBirthday) columns.push({ header: "Дата рождения", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, key: "birthDate", width: 30 });
			if (params.isGender) columns.push({ header: "Пол", key: "gender", style: { alignment: { vertical: 'middle', horizontal: 'left' } },  width: 15 });
			if (params.isProfession) columns.push({ header: "Специальность", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, key: "profession", width: 100 });
			if (params.isDocumentSubmissionDate) columns.push({ header: "Дата подачи документов", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, key: "documentSubmissionDate", width: 40 });
			if (params.isDocumentType) columns.push({ header: "Тип документа", key: "documentType", style: { alignment: { vertical: 'middle', horizontal: 'left' } },  width: 50 });
			if (params.isDocumentSeria) columns.push({ header: "Серия документа", key: "documentSeria", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, width: 40 });
			if (params.isDocumentNumber) columns.push({ header: "Номер документа", key: "documentNumber", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, width: 40 });
			if (params.isDocumentIssueDate) columns.push({ header: "Дата выдачи документа", key: "documentIssueDate", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, width: 40 });
			if (params.isDocumentGiver) columns.push({ header: "Кем выдан", key: "documentGiver", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, width: 50 });
			if (params.includeIsLimitedOpports) columns.push({ header: "Закончил специальную организацию для учащихся с ОВЗ", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, key: "isLimitedOpports", width: 80 });
			if (params.isApartaments) columns.push({ header: "Потребность в общежитии", key: "apartaments", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, width: 50 });
			if (params.includeHasMedicine) columns.push({ header: "Имеется медицинская справка", key: "hasMedicine", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, width: 40 });
			if (params.includeHasOriginalDocs) columns.push({ header: "Поданы оригиналы документов", key: "hasOriginalDocs", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, width: 40 });
			if (params.includeIsInternationalContract) columns.push({ header: "Обучается по международному договору", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, key: "isInternationalContract", width: 40 });
			if (params.isEducationLevel) columns.push({ header: "Уровень образования", key: "educationLevel", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, width: 50 });
			if (params.isEducationType) columns.push({ header: "Форма образования", key: "educationType", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, width: 50 });
			if (params.isEducationFinancials) columns.push({ header: "Финансирование", key: "educationFinancials", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, width: 50 });
			if (params.isResidentialAddress) columns.push({ header: "Адрес проживания", key: "residentialAddress", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, width: 50 });
			if (params.isRegistrationAddress) columns.push({ header: "Адрес регистрации", key: "registrationAddress", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, width: 50 });
			if (params.isBirthPlace) columns.push({ header: "Место рождения", key: "birthPlace", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, width: 50 });
			if (params.isSnils) columns.push({ header: "СНИЛС", key: "snils", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, width: 50 });	
			if (params.isLocality) columns.push({ header: "Населенный пункт", key: "locality", style: { alignment: { vertical: 'middle', horizontal: 'left' } }, width: 50 });
		} else {
			columns.push({ header: "Фамилия", key: "lastName", width: 50 });
			columns.push({ header: "Имя", key: "firstName", width: 50 });
			columns.push({ header: "Отчество", key: "surname", width: 50 });
			columns.push({ header: "Дата рождения", key: "birthDate", width: 30 });
			columns.push({ header: "Пол", key: "gender", width: 15 });
			columns.push({ header: "СНИЛС", key: "snils", width: 50 });	
			columns.push({ header: "Адрес регистрации по месту пребывания", key: "empty", width: 50 });
			columns.push({ header: "Финансирование", key: "educationFinancials", width: 50 });
			columns.push({ header: "Форма образования", key: "educationType", width: 50 });
			columns.push({ header: "Код специальности", key: "professionCode", width: 50 });
			columns.push({ header: "Дата подачи документов", key: "documentSubmissionDate", width: 40 });
			columns.push({ header: "Гражданство", key: "empty", width: 40 });
			columns.push({ header: "Категория здоровья", key: "empty", width: 40 });
			columns.push({ header: "Инвалидность", key: "empty", width: 40 });
			columns.push({ header: "Иностранный язык", key: "empty", width: 40 });
			columns.push({ header: "Уровень образования", key: "educationLevel", width: 50 });
			columns.push({ header: "Дата окончания предыдущего обучения", key: "prevEducationDate", width: 50 });
			columns.push({ header: "Предыдущая образовательная организация", key: "prevEducationOrg", width: 50 });
			columns.push({ header: "Населенный пункт", key: "locality", width: 50 });
			columns.push({ header: "Закончил специальную организацию для учащихся с ОВЗ", key: "isLimitedOpports", width: 80 });
			columns.push({ header: "Потребность в общежитии", key: "apartaments", width: 50 });
			columns.push({ header: "Имеется медицинская справка", key: "hasMedicine", width: 40 });
			columns.push({ header: "Поданы оригиналы документов", key: "hasOriginalDocs", width: 40 });
			columns.push({ header: "Обучается по международному договору", key: "isInternationalContract", width: 40 });
			columns.push({ header: "Средний балл", key: "rating", width: 40 });
			columns.push({ header: "Льгота", key: "empty", width: 40 });
			columns.push({ header: "Телефон", key: "empty", width: 40 });
			columns.push({ header: "Email", key: "empty", width: 40 });
			columns.push({ header: "Доп. инфа", key: "empty", width: 40 });
			columns.push({ header: "Адрес проживания", key: "residentialAddress", width: 50 });
			columns.push({ header: "Тип документа", key: "documentType", width: 50 });
			columns.push({ header: "Серия документа", key: "documentSeria", width: 40 });
			columns.push({ header: "Номер документа", key: "documentNumber", width: 40 });
			columns.push({ header: "Дата выдачи документа", key: "documentIssueDate", width: 40 });
			columns.push({ header: "Кем выдан", key: "documentGiver", width: 50 });
			columns.push({ header: "Код подразделения", key: "documentOrgCode", width: 50 });
			columns.push({ header: "Место рождения", key: "birthPlace", width: 50 });
			columns.push({ header: "Адрес регистрации", key: "registrationAddress", width: 50 });
		}

		worksheet.columns = columns;

		let studentNumber = 1;

		const profession = professions.find((profession) => group.name.toLowerCase().startsWith(profession.abbrevation.toLowerCase()));

		students.forEach((student) => {
			student.number = studentNumber;
			student.gender = student.isFemale ? "Женский" : "Мужской";
			if (type == "csv") {
				if (student.snils != undefined && student.snils != null && student.snils.length > 0) {
					student.snils = student.snils.replaceAll("-", "").replaceAll(" ", "");	
				}
				const fioParts = student.fio.split(" ");
				student.firstName = fioParts[0];
				student.lastName = fioParts[1];
				student.surname = fioParts.length > 2 ? fioParts[2] : "";
			}
			student.empty = "";
			student.hasOriginalDocs = student.hasOriginalDocs == 1 ? "да" : "нет";
			student.isInternationalContract = student.isInternationalContract == 1 ? "да" : "нет";
			student.isLimitedOpports = student.isLimitedOpports == 1 ? "да" : "нет";
			student.hasMedicine = student.hasMedicine == 1 ? "да" : "нет";
			
			if (type == "xls") {
				student.profession = profession == undefined || profession == null ? ""
					: profession.code + " " + profession.name;
			} else {
				student.professionCode = profession == undefined || profession == null ? "" : profession.code;
			}
		
			worksheet.addRow(student);
			studentNumber++;
		});

		worksheet.getRow(1).eachCell((cell) => {
			cell.font = { bold: true };
		});

		const filenames = fs.readdirSync(path.resolve(__dirname, 'static'));
		filenames.forEach((file) => fs.unlinkSync(path.resolve(__dirname, 'static/' + file)));

		if (type == "csv") {
			worksheet.spliceRows(0, 1);

			const csvFileName = `static/${group.name}_.csv`;
			const csvOriginalFileName = `static/${group.name}.csv`;
			const csv_path = path.resolve(__dirname, csvFileName);
			workbook.csv.writeFile(csv_path, {
 				formatterOptions: {
				    delimiter: ';',
				    quote: false
  				}
			}).then(() => {
				fs.createReadStream(csv_path)
    				.pipe(iconv.decodeStream('utf8'))
    				.pipe(iconv.encodeStream('win1251'))
    				.pipe(fs.createWriteStream(csvOriginalFileName));
				res.json(success(`${BASE_URL}/${csvOriginalFileName}`));
			});			
		} else {
			const xls_path = path.resolve(__dirname, `static/${group.name}.xlsx`);
			workbook.xlsx.writeFile(xls_path).then(() => {
				res.json(success(`${BASE_URL}/static/${group.name}.xlsx`));
			});
		}		
	}
});

app.post('/students/import', (req, res) => {
  
	const filenames = fs.readdirSync(path.resolve(__dirname, 'static'));
	filenames.forEach((file) => fs.unlinkSync(path.resolve(__dirname, 'static/' + file)));

  const file = req.files.file;
  file.mv('./static/' + file.name).then(() => {
  	const workbook = new excel.Workbook(); 
  	workbook.xlsx.readFile('./static/' + file.name).then(() => {
  	
  		const year = (new Date()).getFullYear();

  		database.all("select * from groups", (err, groups) => {
  			
  			let currentGroupId = groups[groups.length - 1].id;
  			
  			database.serialize(() => {
  				
  				const mappedGroups = {};

  				workbook.worksheets.forEach((sheet) => {
		  			sheet.eachRow({}, (row, number) => {
		  				
		    			if (number >= 3) {
		    				const fio = row.values[3];
		    				const rating = row.values[4];

		    				const hasOriginalDocs = row.values[5].toLowerCase() == "оригинал" ? 1 : 0;
		    				const apartaments = (row.values[6] != undefined && row.values[6] != null 
		    					&& row.values[6].toLowerCase() == "да") ? "Нуждается в общежитии" : "Не требуется";
		    			
		    				const firstGroup = row.values[7];
		    				const secondGroup = row.values[8];
		    				const thirdGroup = row.values[9];

		    				function checkGroup(foundGroup, group, currentId, mappedGroups, db) {
		    					if (foundGroup == undefined || foundGroup == null) {
		    						if (mappedGroups[group] != undefined && mappedGroups[group] != null) {
		    							return mappedGroups[group];
		    						} else {
		    							const groupName = `${group.trim()}-${year}`;
			    						db.run("replace into groups (name, count) values (?, ?)", [ groupName, 25 ]);	    					
			    						const newPriority = currentId + 1;
			    						mappedGroups[groupName] = newPriority;
			    						return newPriority;	
		    						}
			    				} else {
			    					return foundGroup.id;
			    				}
		    				}

		    				const foundedFirstGroup = groups.find((group) => group.name.toLowerCase().indexOf(firstGroup.trim().toLowerCase()) == 0);
		    				const priorityOne = checkGroup(foundedFirstGroup, firstGroup, currentGroupId, mappedGroups, database);
		    				if (currentGroupId < priorityOne) currentGroupId++;


		    				let priorityTwo = -1;
		    				if (secondGroup != undefined && secondGroup != null && secondGroup.trim().length >= 2) {
		    					const foundedSecondGroup = groups.find((group) => group.name.toLowerCase().indexOf(secondGroup.trim().toLowerCase()) == 0);
		    					priorityTwo = checkGroup(foundedSecondGroup, secondGroup, currentGroupId, mappedGroups, database);
		    					if (currentGroupId < priorityTwo) currentGroupId++;
		    				}

		    				let priorityThree = -1;
		    				if (thirdGroup != undefined && thirdGroup != null && thirdGroup.trim().length >= 2) {
		    					const foundedThirdGroup = groups.find((group) => group.name.toLowerCase().indexOf(thirdGroup.trim().toLowerCase()) == 0);
		    					priorityThree = checkGroup(foundedThirdGroup, thirdGroup, currentGroupId, mappedGroups, database);
		    					if (currentGroupId < priorityThree) currentGroupId++;
		    				}

							const student = [ fio, parseFloat(rating), priorityOne, priorityTwo, priorityThree, "", 0, "", "", "", "Не указано", "", "", "", "", 0, 1, hasOriginalDocs, 0, "Не указано", "Не указано", "Не указано", "", "", "", apartaments, "", "", "" ];

							const sql = "insert into students (fio, rating, priorityOne, priorityTwo, priorityThree, birthDate, isFemale, documentSubmissionDate, snils, locality, documentType, documentSeria, documentNumber, documentIssueDate, documentGiver, isLimitedOpports, hasMedicine, hasOriginalDocs, isInternationalContract, educationLevel, educationType, educationFinancials, residentialAddress, registrationAddress, birthPlace, apartaments, prevEducationDate, prevEducationOrg, documentOrgCode) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

							database.run(sql, student);
		    			}
		    	
		    		});
  				});
  				database.run("select * from groups", () => res.json(success("все окей!")));
  			});
  		});

  	}); 

  }); 
});

app.post("/students/clear", (req, res) => {
	database.run("delete from students", (err) => {
		res.json(success("успешно удалены все записи из БД"));
	});
});

app.get("/students", (req, res) => {
	database.all("select * from students",  (err, data) => {
		if (err != null && err != undefined) {
			res.json(error("возникла неизвестная проблема с базой данных"));
		} else {
			res.set("Access-Control-Allow-Origin", "*");
			res.json(success(data));
		}
	});
});

app.get("/ratedStudents", (req, res) => {
	database.all("select * from groups", (err, groups) => {
		if (err != null || err != undefined) {
			res.json(error("возникла неизвестная проблема с базой данных"));
		} else {
			database.all("select * from students", (err, dbStudents) => {
				if (err != null && err != undefined) {
					res.json(error("возникла неизвестная проблема с базой данных"));
				} else {
					const students = ratedStudents(groups, dbStudents);
					res.json(success({
						groups: groups,
						students: students
					}));
				}
			})
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
	console.log(student);
	if (!("fio" in student)) {
		res.json(error("не указана фамилия студента"));
	} else if (!("rating" in student)) {
		res.json(error("не указан балл студента"));
	} else if (!("priorityOne" in student)) {
		res.json(error("не указана первая группа для студента"));
	} else {
		
		database.run("insert into students (fio, rating, priorityOne, priorityTwo, priorityThree, birthDate, isFemale, documentSubmissionDate, documentType, documentSeria, documentNumber, documentIssueDate, documentGiver, isLimitedOpports, hasMedicine, hasOriginalDocs, isInternationalContract, educationLevel, educationType, educationFinancials, residentialAddress, registrationAddress, birthPlace, apartaments, snils, locality, prevEducationDate, prevEducationOrg, documentOrgCode) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
			[ 
				student.fio, student.rating, student.priorityOne, student.priorityTwo,
				student.priorityThree, student.birthDate, student.isFemale,
				student.documentSubmissionDate, student.documentType,
				student.documentSeria, student.documentNumber, student.documentIssueDate,
				student.documentGiver, student.isLimitedOpports, student.hasMedicine,
				student.hasOriginalDocs, student.isInternationalContract, student.educationLevel,
				student.educationType, student.educationFinancials, student.residentialAddress,
				student.registrationAddress, student.birthPlace, student.apartaments, 
				student.snils, student.locality, student.prevEducationDate,
				student.prevEducationOrg, student.documentOrgCode
			], (err) => {
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
	} else if (!("priorityOne" in student)) {
		res.json(error("не указана первая группа для студента"));
	} else {
		const data = [ 
			student.fio, student.rating, student.priorityOne, student.priorityTwo,
			student.priorityThree, student.birthDate, student.isFemale, student.documentSubmissionDate, 
			student.documentType,
			student.documentSeria, student.documentNumber, student.documentIssueDate,
			student.documentGiver, student.isLimitedOpports, student.hasMedicine,
			student.hasOriginalDocs, student.isInternationalContract, student.educationLevel,
			student.educationType, student.educationFinancials, student.residentialAddress,
			student.registrationAddress, student.birthPlace, student.apartaments, 
			student.snils, student.locality, student.prevEducationDate, student.prevEducationOrg, 
			student.documentOrgCode, student.id 
		]

		database.run("update students set fio = ?, rating = ?, priorityOne = ?, priorityTwo = ?, priorityThree = ?, birthDate = ?, isFemale = ?, documentSubmissionDate = ?, documentType = ?, documentSeria = ?, documentNumber = ?, documentIssueDate = ?, documentGiver = ?, isLimitedOpports = ?, hasMedicine = ?, hasOriginalDocs = ?, isInternationalContract = ?, educationLevel = ?, educationType = ?, educationFinancials = ?, residentialAddress = ?, registrationAddress = ?, birthPlace = ?, apartaments = ?, snils = ?, locality = ?, prevEducationDate = ?, prevEducationOrg = ?, documentOrgCode = ? where id = ?", 
			data, (err) => {
			if (err != null && err != undefined) {
				res.json(error("возникли проблемы при добавлении студента в базу данных"));
			} else {
				res.json(successMessage("успешно добавлен студент"));
			}	
		});
	}
});

/**=================================================
============== PROFESSION API METHODS ==============
===================================================*/

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

app.post("/professions/remove", (req, res) => {
	const profession = req.body;
	if (!("id") in profession) {
		res.json(error("не указан id специальности"));
	} else {
		const id = profession.id;
		database.run("delete from professions where id = ?", [ id ], (err) => {
			res.json(successMessage("успешно удалена специальность!"));
		});
	}
});

app.post("/professions/update", (req, res) => {
	const profession = req.body;
	if (!("id") in profession) {
		res.json(error("не указан id специальности"));
	} else if (!("name" in profession)) {
		res.json(error("не указано название специальности"));
	} else if (!("code" in profession)) {
		res.json(error("не указан код специальности"));
	} else {
		const id = profession["id"];
		const name = profession["name"];
		const code = profession["code"];
		const abbrevation = profession["abbrevation"];
		console.log(name);
		database.run("update professions set name = ?, code = ?, abbrevation = ? where id = ?", 
			[ name, code, abbrevation, id ], (err) => {
				console.log(err);
			if (err != null && err != undefined) {
				res.json(error("возникли проблемы при обновлении специальности в базе данных"));
			} else {
				res.json(successMessage("успешно обновлена специальность!"));
			}
		})
	}
});

app.post("/professions/add", (req, res) => {
	const profession = req.body;
	if (!("name" in profession)) {
		res.json(error("не указано название специальности"));
	} else if (!("code" in profession)) {
		res.json(error("не указан код специальности"));
	} else {
		const name = profession["name"];
		const code = profession["code"];
		const abbrevation = profession["abbrevation"];
		database.run("insert into professions (name, code, abbrevation) values (?, ?, ?)", [ name, code, abbrevation ], (err) => {
			if (err != null && err != undefined) {
				res.json(error("возникли проблемы при добавлении специальности в базу данных"));
			} else {
				res.json(successMessage("успешно добавлена специальность!"));
			}
		})
	}
});

/**================================================
================ GROUP API METHODS ================
===================================================*/

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
		const count = group["count"];
		database.run("insert into groups (name, count) values (?, ?)", [ name, count ], (err) => {
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
		database.run("update groups set name = ?, count = ? where id = ?", [ group.name, group.count, group.id ], (err) => {
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
