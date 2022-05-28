const sqlite = require('sqlite3').verbose();
const path = require('path');

const database_file_path = path.resolve(__dirname, 'database.db');
const database = new sqlite.Database(database_file_path);


const groups = [
	"ЭСХ", "МЭП", "КСК", "ЛП", "ТМ", "ТВ", "ТЭ", "АГ", "ОПИ", "РПИ", 
	"ТО", "МСХ", "ММ", "МС", "ПМ", "СВ", "ПК", "АМ"
]

const professions = [
	{
		code: "08.02.09",
		name: "Монтаж, наладка и эксплуатация электрооборудования промышленных и гражданских зданий",
		abbrevation: "МЭП"
	},
	{
		code: "09.02.01",
		name: "Компьютерные системы и комплексы",
		abbrevation: "КСК"
	},
	{
		code: "15.02.08",
		name: "Технология машиностроения",
		abbrevation: "ТМ"
	},
	{
		code: "21.02.17",
		name: "Подземная разработка месторождений полезных ископаемых",
		abbrevation: "ПМП"
	},
	{
		code: "21.02.18",
		name: "Обогащение полезных ископаемых",
		abbrevation: "ОПИ"
	},
	{
		code: "22.02.03",
		name: "Литейное производство черных и цветных металлов",
		abbrevation: "ЛП"
	},
	{
		code: "35.02.08",
		name: "Электрификация и автоматизация сельского хозяйства",
		abbrevation: "ЭСХ"
	},
	{
		code: "35.02.05",
		name: "Агрономия",
		abbrevation: "АГ"
	},
	{
		code: "38.02.05",
		name: "Товароведение  и экспертиза качества потребительских товаров",
		abbrevation: "ТВ"
	},
	{
		code: "15.01.05",
		name: "Сварщик (ручной и частично механизированной сварки (наплавки)",
		abbrevation: "СВ"
	},
	{
		code: "19.01.10",
		name: "Мастер производства молочной продукции",
		abbrevation: "ММП"
	},
	{
		code: "08.01.05",
		name: "Мастер столярно-плотничных и паркетных работ",
		abbrevation: "МПП"
	},
	{
		code: "43.01.02",
		name: "Парикмахер",
		abbrevation: "ПМ"
	},
	{
		code: "43.01.09",
		name: "Повар, кондитер",
		abbrevation: "ПК"
	}
];

database.serialize(() => {
	database.run("create table if not exists groups (id integer primary key autoincrement, name varchar(20) unique, count integer)");	
	database.run("create table if not exists students (id integer primary key autoincrement, fio varchar(100), rating real, priorityOne integer, priorityTwo integer, priorityThree integer, birthDate varchar(9), isFemale boolean, documentSubmissionDate varchar(9), snils varchar(11), locality varchar(256), documentType varchar(60), documentSeria varchar(8), documentNumber varchar(16), documentIssueDate varchar(9), documentGiver varchar(128), isLimitedOpports boolean, hasMedicine boolean, hasOriginalDocs boolean, isInternationalContract boolean, educationLevel varchar(80), educationType varchar(16), educationFinancials varchar(80), residentialAddress varchar(500), registrationAddress varchar(500), birthPlace varchar(128), apartaments varchar(25), prevEducationDate varchar(9), prevEducationOrg varchar(256), documentOrgCode varchar(32))");																															
	database.run("create table if not exists professions (id integer primary key autoincrement, code varchar(10), name varchar(100), abbrevation varchar(15))");

	const year = (new Date()).getFullYear();

	groups.forEach(group => {
		database.run("insert into groups (name, count) values (?, ?)", [ `${group}-${year}`, 25 ]);
	});

	professions.forEach(profession => {
		database.run("insert into professions (code, name, abbrevation) values (?, ?, ?)", [ 
			profession.code, profession.name, profession.abbrevation 
		]);
	});

});
