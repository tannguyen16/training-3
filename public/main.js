let SORT = {
    UNSORTED: 0,
    INC: 1,
    DESC: -1,
}
let id = 5;
let nameSorted = SORT.UNSORTED;
let gradeSorted = SORT.UNSORTED;

let students = [];

$(function() {
    const table = $('#student-table');
    const tbody = table.find('tbody');
    const newNameInput = $('#name-input');
    const newGradeInput = $('#grade-input');
    const addForm = $('#add-form');

    table.on('click', '#thead-name', function(event) {
        if (nameSorted === SORT.UNSORTED || nameSorted === SORT.DESC) {
            nameSorted = SORT.INC;
            $('#thead-name').html('Name ↓');
        }
        else {
            nameSorted = SORT.DESC
            $('#thead-name').html('Name ↑');
        }

        $.ajax({
                url: `http://localhost:3000/api/users?sort=name&dir=${nameSorted}`,
                success: function(response) {
                    students = response;
                    renderTable();
                },
                error: function (xhr, status, error) {
                    alert("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText);
                }
            })
    });

    table.on('click', '#thead-grade', function(event) {
        if (gradeSorted === SORT.UNSORTED || gradeSorted === SORT.DESC) {
            gradeSorted = SORT.INC;
            $('#thead-grade').html('Grade ↓');
        }
        else {
            gradeSorted = SORT.DESC;
            $('#thead-grade').html('Grade ↑');
        }

        $.ajax({
                url: `http://localhost:3000/api/users?sort=grade&dir=${gradeSorted}`,
                success: function(response) {
                    students = response;
                    renderTable()
                },
                error: function (xhr, status, error) {
                    alert("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
                }
            })
    });

    table.on('click', '.edit-btn', function(event) {
        const rowId = event.currentTarget.dataset.id;
        const student = students.find(student => student._id === rowId);
        const row = $(event.currentTarget).parent().parent().parent().parent();
        const editOptions = `
            <td>
                <input type="text" name="name" value="${student.name}" />
            </td>
            <td>
                <input type="number" name="grade" value="${student.grade}" />
            </td>
            <td>
                <button class="reset-btn" data-id="${student._id}" data-name="${student.name}" data-grade="${student.grade}">Reset</button>
                <button class="save-btn" data-id="${student._id}">Save</button>
                <button class="cancel-btn" data-id="${student._id}">Cancel</button>
            </td>
        `;
        row.html(editOptions);
    });

    table.on('click', '.reset-btn', function(event) {
        const rowId = event.currentTarget.dataset.id;
        const resetName = event.currentTarget.dataset.name;
        const resetGrade = event.currentTarget.dataset.grade;
        const row = $(event.currentTarget).parent().parent();
        const editOptions = `
            <td>
                <input type="text" name="name" value="${resetName}" />
            </td>
            <td>
                <input type="number" name="grade" value="${resetGrade}" />
            </td>
            <td>
                <button class="reset-btn" data-id="${rowId}" data-name="${resetName}" data-grade="${resetGrade}">Reset</button>
                <button class="save-btn" data-id="${rowId}">Save</button>
                <button class="cancel-btn" data-id="${rowId}">Cancel</button>
            </td>
        `;
        row.html(editOptions);
    });

    table.on('click', '.save-btn', function(event) {
        const rowId = event.currentTarget.dataset.id;
        const inputName = $('input[name=name]').val();
        const inputGrade = $('input[name=grade]').val();
        if(!inputName){
        alert('Student name cannot be empty');
            return;
        }
        if(!inputGrade){
            alert('Student grade cannot be empty');
            return;
        }
        if(inputGrade < 0){
            alert('Student grade cannot be negative');
            return;
        }
        const student = students.find(student => student._id === rowId);
        student.name = inputName;
        student.grade = inputGrade;
        const data = {
            name: inputName,
            grade: inputGrade,
        }
        $.ajax({
            type: 'PUT',
            url: `http://localhost:3000/api/users/${rowId}`,
            data: data,
            success: function(response) {
                renderInitialTable();
            },
            error: function (xhr, status, error) {
                alert("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
            }
        })
    });

    table.on('click', '.cancel-btn', function(event) {
        const rowId = event.currentTarget.dataset.id;
        const student = students.find(student => student._id === rowId);
        let row = $(event.currentTarget).parent().parent();
        const newRow = $('<tr/>');
        const colName = $('<td/>').text(student.name);
        const colGrade = $('<td/>').text(student.grade);
        const colOptions = $('<td/>').html(`
            <div class="option">
                <button class="option-btn">...</button>
                <div class="option-list">
                    <a href="#" class="edit-btn" data-id="${rowId}">Edit</a>
                    <a href="#" class="delete-btn" data-id="${rowId}">Delete</a>
                </div>
            </div>
        `);

        newRow
            .append(colName)
            .append(colGrade)
            .append(colOptions);

        row.replaceWith(newRow);
    });

    table.on('click', '.delete-btn', function(event) {
        const id = event.currentTarget.dataset.id;
        $.ajax({
            type: 'DELETE',
            url: `http://localhost:3000/api/users/${id}`,
            success: function(response) {
                renderInitialTable();
            },
            error: function (xhr, status, error) {
                alert("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
            }
        })

    });

    addForm.on('submit', function(event) {
        event.preventDefault();

        const newName = newNameInput.val();
        const newGrade = newGradeInput.val();
        if(!newName){
        alert('Student name cannot be empty');
            return;
        }
        if(!newGrade){
            alert('Student grade cannot be empty');
            return;
        }
        if(newGrade < 0){
            alert('Student grade cannot be negative');
            return;
        }
        const data = {
            name: newName,
            grade: newGrade,
        }
        $.ajax({
            type: 'POST',
            url: `http://localhost:3000/api/users`,
            data: data,
            success: function(response) {
                renderInitialTable();
            },
            error: function (xhr, status, error) {
                alert("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
            }
        })

        newNameInput.val('');
        newGradeInput.val('');
    });

    function addRow(id, name, grade) {
        const row = $('<tr/>');
        const colName = $('<td/>').text(name);
        const colGrade = $('<td/>').text(grade);
        const colOptions = $('<td/>').html(`
            <div class="option">
                <button class="option-btn">...</button>
                <div class="option-list">
                    <a href="#" class="edit-btn" data-id="${id}">Edit</a>
                    <a href="#" class="delete-btn" data-id="${id}">Delete</a>
                </div>
            </div>
        `);

        row
            .append(colName)
            .append(colGrade)
            .append(colOptions);

        tbody.append(row);
    }

    function renderInitialTable() {
        $.ajax({
            url: `http://localhost:3000/api/users`,
            success: function(response) {
                students = response;
                renderTable();
            },
            error: function (xhr, status, error) {
                alert("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
            }
        })
    }

    function renderTable() {
        tbody.html('');
        students.forEach(student => {
            addRow(student._id, student.name, student.grade);
        });
    }

    renderInitialTable();
});