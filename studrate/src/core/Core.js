import constants from './Constants.js';

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
	totalStudents,
	otherStudents1,
	otherStudents2,
	isLast
) {
	const studentCount = constants.studentCount;
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

export default function ratedStudents(students) {
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
			student, studentsByGroup[student.priorityOne],
			studentsQueue, 
			studentsByGroup[student.priorityTwo],
			studentsByGroup[student.priorityThree]
		);
		if (!isFirstGroupReordered && studentsByGroup[student.priorityTwo] != undefined) {
			var isSecondGroupReordered = reorderGroups(
				student, studentsByGroup[student.priorityTwo],
				studentsQueue, 
				studentsByGroup[student.priorityOne],
				studentsByGroup[student.priorityThree],
				true
			);
			if (!isSecondGroupReordered && studentsByGroup[student.priorityThree] != undefined) {
				reorderGroups(
					student, studentsByGroup[student.priorityThree],
					studentsQueue, 
					studentsByGroup[student.priorityOne],
					studentsByGroup[student.priorityTwo]
				);
			}
		}
	}
	return studentsByGroup;
}

// var students = [
//     { "id" : 0, "fio" : "Student 1", "rating" : 4.5, "priority_one" : 0 },
//     { "id" : 1, "fio" : "Student 2", "rating" : 4.2, "priority_one" : 0 },
//     { "id" : 2, "fio" : "Student 3", "rating" : 4.1, "priority_one" : 0, "priority_two" : 1 },
//     { "id" : 3, "fio" : "Student 4", "rating" : 4.0, "priority_one" : 0, "priority_two" : 1 },
//     { "id" : 4, "fio" : "Student 5", "rating" : 4.1, "priority_one" : 1 },
//     { "id" : 5, "fio" : "Student 6", "rating" : 4.0, "priority_one" : 1 },
//     { "id" : 6, "fio" : "Student 7", "rating" : 3.9, "priority_one" : 1, "priority_two" : 2 },
//     { "id" : 7, "fio" : "Student 8", "rating" : 3.9, "priority_one" : 2 },
//     { "id" : 8, "fio" : "Student 9", "rating" : 3.6, "priority_one" : 2 },
//     { "id" : 9, "fio" : "Student 10", "rating" : 3.5, "priority_one" : 2 },
//     { "id" : 10, "fio" : "Student 11", "rating" : 5.0, "priority_one" : 0, "priority_two" : 1 }
// ];

// console.log(ratedStudents(students));