
const STUDENT_COUNT_MAX_IN_GROUP = 25;
const BASE_URL = "http://localhost:3434"

export default {
	"studentCount" : STUDENT_COUNT_MAX_IN_GROUP,
	"restData": {
		"getGroups" : BASE_URL + "/groups",
		"postGroupAdd" : BASE_URL + "/groups/add",
		"postGroupRemove" : BASE_URL + "/groups/remove",
		"postGroupUpdate" : BASE_URL + "/groups/update",

		"getStudents" : BASE_URL + "/ratedStudents",
		"postStudentAdd" : BASE_URL + "/students/add",
		"postStudentRemove" : BASE_URL + "/students/remove",
		"postStudentUpdate" : BASE_URL + "/students/update",
		"postStudentClear" : BASE_URL + "/students/clear",
		"postStudentImport" : BASE_URL + "/students/import",
		"postStudentExport": BASE_URL + "/students/export",
		"postStudentGenerate" : BASE_URL + "/students/generate",
		"postStudentTitlesExport" : BASE_URL + "/students/titlepage/export",
 
		"getProfessions" : BASE_URL + "/professions",
		"postProfessionAdd" : BASE_URL + "/professions/add",
		"postProfessionUpdate" : BASE_URL + "/professions/update",
		"postProfessionRemove": BASE_URL + "/professions/remove",

		"postStatisticsExport" : BASE_URL + "/students/statistics/export"
	}
};