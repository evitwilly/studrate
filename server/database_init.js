const sqlite = require('sqlite3').verbose();
const path = require('path');

const database_file_path = path.resolve(__dirname, 'database.db');
const database = new sqlite.Database(database_file_path);


const groups = [
	"ЭСХ", "МЭП", "КСК", "ЛП", "ТМ", "ТВ", "ТЭ", "АГ", "ОПИ", "РПИ", "ТО", "МСХ", "ММ", "МС", "ПМ", "СВ", "ПК", "АМ"
]

const professions = [
	{
		code: "08.02.09",
		name: "Монтаж, наладка и эксплуатация электрооборудования промышленных и гражданских зданий"
	},
	{
		code: "09.02.01",
		name: "Компьютерные системы и комплексы"
	},
	{
		code: "15.02.08",
		name: "Технология машиностроения"
	},
	{
		code: "21.02.17",
		name: "Подземная разработка месторождений полезных ископаемых"
	},
	{
		code: "21.02.18",
		name: "Обогащение полезных ископаемых"
	},
	{
		code: "22.02.03",
		name: "Литейное производство черных и цветных металлов"
	},
	{
		code: "35.02.08",
		name: "Электрификация и автоматизация сельского хозяйства"
	},
	{
		code: "35.02.05",
		name: "Агрономия"
	},
	{
		code: "38.02.05",
		name: "Товароведение  и экспертиза качества потребительских товаров"
	},
	{
		code: "15.01.05",
		name: "Сварщик (ручной и частично механизированной сварки (наплавки)"
	},
	{
		code: "19.01.10",
		name: "Мастер производства молочной продукции"
	},
	{
		code: "08.01.05",
		name: "Мастер столярно-плотничных и паркетных работ"
	},
	{
		code: "43.01.02",
		name: "Парикмахер"
	},
	{
		code: "43.01.09",
		name: "Повар, кондитер"
	}
];

database.serialize(() => {
	database.run("create table if not exists groups (id integer primary key autoincrement, name varchar(20))");	
	database.run("create table if not exists students (id integer primary key autoincrement, fio varchar(100), rating real, priorityOne integer, priorityTwo integer, priorityThree integer)");
	database.run("create table if not exists professions (id integer primary key autoincrement, code varchar(10), name varchar(100))");

	const year = (new Date()).getFullYear();

	groups.forEach(group => {
		database.run("insert into groups (name) values (?)", [ `${group}-${year}` ]);
	});

	professions.forEach(profession => {
		database.run("insert into professions (code, name) values (?, ?)", [ profession.code, profession.name ]);
	});

});
