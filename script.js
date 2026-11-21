
// Get student records from browser storage

let students = [];

try {
    students = JSON.parse(localStorage.getItem("students")) || [];

    if (!Array.isArray(students)) {
        students = [];
    }
} catch (error) {
    students = [];
}

let editingId = null;


// Get form elements

const form = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");


// Save student records

function saveData() {
    try {
        localStorage.setItem("students", JSON.stringify(students));
        return true;
    } catch (error) {
        alert("Unable to save student records.");
        return false;
    }
}


// Display student records

function displayStudents() {

    studentTable.innerHTML = "";

    let searchText = searchInput.value.toLowerCase().trim();

    let foundStudents = students.filter(student =>

        student.id.toLowerCase().includes(searchText) ||
        student.name.toLowerCase().includes(searchText) ||
        student.email.toLowerCase().includes(searchText) ||
        student.course.toLowerCase().includes(searchText)

    );

    document.getElementById("studentCount").textContent =
        students.length;

    let message = document.getElementById("message");

    if (students.length === 0) {
        message.textContent = "No student records available.";
    } else if (foundStudents.length === 0) {
        message.textContent = "No matching students found.";
    } else {
        message.textContent = "";
    }

    foundStudents.forEach(student => {

        let row = document.createElement("tr");

        let values = [
            student.id,
            student.name,
            student.email,
            student.course,
            student.gender
        ];

        values.forEach(value => {
            let cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        let actionCell = document.createElement("td");

        let editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.onclick = () => editStudent(student.id);

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.onclick = () => deleteStudent(student.id);

        actionCell.append(editButton, deleteButton);

        row.appendChild(actionCell);

        studentTable.appendChild(row);

    });

}


// Register or update a student

form.addEventListener("submit", function(event) {

    event.preventDefault();

    let student = {

        id: document.getElementById("studentId").value.trim(),

        name: document.getElementById("studentName").value.trim(),

        email: document.getElementById("studentEmail").value.trim(),

        course: document.getElementById("studentCourse").value.trim(),

        gender: document.getElementById("studentGender").value

    };

    // Check for duplicate student numbers

    let duplicate = students.some(s =>
        s.id.toLowerCase() === student.id.toLowerCase() &&
        s.id !== editingId
    );

    if (duplicate) {
        alert("This student number already exists.");
        return;
    }

    if (editingId !== null) {

        let index = students.findIndex(s => s.id === editingId);

        if (index === -1) {
            alert("Student record not found.");
            cancelUpdate();
            return;
        }

        let oldStudent = students[index];

        students[index] = student;

        if (!saveData()) {
            students[index] = oldStudent;
            return;
        }

        alert("Student information updated successfully.");

    } else {

        students.push(student);

        if (!saveData()) {
            students.pop();
            return;
        }

        alert("Student registered successfully.");

    }

    cancelUpdate();

    searchInput.value = "";

    displayStudents();

});


// Edit student information

function editStudent(id) {

    let student = students.find(s => s.id === id);

    if (!student) return;

    editingId = id;

    document.getElementById("studentId").value = student.id;
    document.getElementById("studentName").value = student.name;
    document.getElementById("studentEmail").value = student.email;
    document.getElementById("studentCourse").value = student.course;
    document.getElementById("studentGender").value = student.gender;

    document.getElementById("submitBtn").textContent =
        "Update Student";

    document.getElementById("cancelBtn").hidden = false;

    window.scrollTo(0, 0);

}


// Cancel update

function cancelUpdate() {

    editingId = null;

    form.reset();

    document.getElementById("submitBtn").textContent =
        "Add Student";

    document.getElementById("cancelBtn").hidden = true;

}


// Delete a student

function deleteStudent(id) {

    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    let oldStudents = students;

    students = students.filter(student => student.id !== id);

    if (!saveData()) {
        students = oldStudents;
        return;
    }

    if (editingId === id) {
        cancelUpdate();
    }

    displayStudents();

}


// Search for students

searchInput.addEventListener("input", displayStudents);


// Show saved records when the page opens

displayStudents();
