
const STUDENT_COUNT_MAX_IN_GROUP = 25;
const BASE_URL = "http://localhost:3434"


export default {
	"studentCount" : STUDENT_COUNT_MAX_IN_GROUP,
	"restData": {
		"getGroups" : BASE_URL + "/groups",
		"postGroupAdd" : BASE_URL + "/groups/add",
		"postGroupRemove" : BASE_URL + "/groups/remove",
		"postGroupExport" : BASE_URL + "/groups/export",
		"postGroupUpdate" : BASE_URL + "/groups/update",
		"getStudents" : BASE_URL + "/students",
		"postStudentAdd" : BASE_URL + "/students/add",
		"postStudentRemove" : BASE_URL + "/students/remove",
		"postStudentUpdate" : BASE_URL + "/students/update",
		"getProfessions" : BASE_URL + "/professions",
		"postProfessionAdd" : BASE_URL + "/professions/add"
	}
};