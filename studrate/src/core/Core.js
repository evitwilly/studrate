
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

export default function ratedStudents(groups, students) {
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