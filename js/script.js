let tasks = []; 
let teamMembers = []; 

function addTeamMember() {
    const addTeam = document.getElementById('addTeam');

    if (addTeam.value.trim() === '') {
        alert('Додайте команду/члена команди.');
        return;
    }

    teamMembers.push(addTeam.value.trim());
    addTeam.value = ''; 
    updateTeamMembersMenu(); 
}

function updateTeamMembersMenu() {
    const assignSelect = document.getElementById('assignSelect');
    assignSelect.innerHTML = ''; 

    const unassignedOption = document.createElement('option');
    unassignedOption.value = '';
    unassignedOption.innerText = 'Unassigned';
    assignSelect.appendChild(unassignedOption);

    teamMembers.forEach(member => {
        const option = document.createElement('option');
        option.value = member;
        option.innerText = member;
        assignSelect.appendChild(option);
    });
}

function assignTask(task, member) {
    task.assignedTo = member;
    const taskElem = document.querySelector(`.task[data-id="${task.id}"]`);
    const assignedToSpan = taskElem.querySelector('.assigned-to');

    if (!assignedToSpan) {
        const newAssignedToSpan = document.createElement('span');
        newAssignedToSpan.className = 'assigned-to';
        newAssignedToSpan.innerText = `Призначено: ${member}`;
        taskElem.appendChild(newAssignedToSpan);
    } else {
        assignedToSpan.innerText = `Assigned to: ${member}`;
    }
}

function unassignTask(task) {
    task.assignedTo = '';
    const taskElem = document.querySelector(`.task[data-id="${task.id}"]`);
    const assignedToSpan = taskElem.querySelector('.assigned-to');
    if (assignedToSpan) {
        assignedToSpan.remove();
    }
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    if (taskInput.value.trim() === '') {
        alert('Додайте завдання.');
        return;
    }

    const task = {
        id: Date.now(),
        name: taskInput.value,
        priority: 'normal', 
        deadline: '', 
        comments: [], 
        assignedTo: '' 
    };

    tasks.push(task); 

    renderTask(task); 

    taskInput.value = '';
}

function renderTask(task) {
    const taskList = document.getElementById('taskList');

    const taskElem = document.createElement('div');
    taskElem.className = 'task';
    taskElem.dataset.id = task.id;

    const taskName = document.createElement('div');
    taskName.className = 'task-name';
    taskName.innerText = task.name;

    const editButton = document.createElement('button');
    editButton.innerText = 'Редагувати';
    editButton.onclick = function() {
        editTask(task);
    };

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Видалити';
    deleteButton.onclick = function() {
        deleteTask(task);
    };

    const priorityLabel = document.createElement('span');
    priorityLabel.innerText = 'Пріоритет: ';

    const prioritySelect = document.createElement('select');
    prioritySelect.innerHTML = `
        <option value="low">Нижчий</option>
        <option value="normal">Стандарт</option>
        <option value="high">Високий</option>
    `;
    prioritySelect.value = task.priority; 

    prioritySelect.onchange = function() {
        task.priority = prioritySelect.value;
        sortTasks(); 
    };

    const deadlineLabel = document.createElement('span');
    deadlineLabel.innerText = ' Дедлайн: ';

    const deadlineInput = document.createElement('input');
    deadlineInput.type = 'date';
    deadlineInput.value = task.deadline;
    deadlineInput.onchange = function() {
        task.deadline = deadlineInput.value;
        sortTasks(); 
    };

    const assignSelect = document.createElement('select');
    const unassignedOption = document.createElement('option');
    unassignedOption.value = '';
    unassignedOption.innerText = 'Не визначено';
    assignSelect.appendChild(unassignedOption);

    teamMembers.forEach(member => {
        const option = document.createElement('option');
        option.value = member;
        option.innerText = member;
        assignSelect.appendChild(option);
    });

    assignSelect.value = task.assignedTo;
    assignSelect.onchange = function() {
        const selectedMember = assignSelect.value;
        if (selectedMember === '') {
            unassignTask(task);
        } else {
            assignTask(task, selectedMember);
        }
    };

    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.placeholder = 'Коментар';

    const commentButton = document.createElement('button');
    commentButton.innerText = 'Додати коментар';
    commentButton.onclick = function() {
        addComment(task, commentInput.value);
        commentInput.value = '';
    };

    const commentsList = document.createElement('ul');
    commentsList.className = 'comments-list';
    task.comments.forEach(comment => {
        const commentItem = document.createElement('li');
        commentItem.innerText = comment;
        commentsList.appendChild(commentItem);
    });

    
    if (task.assignedTo !== '') {
        const assignedToSpan = document.createElement('span');
        assignedToSpan.className = 'assigned-to';
        assignedToSpan.innerText = `Призначено: ${task.assignedTo}`;
        taskElem.appendChild(assignedToSpan);
    }

    taskElem.appendChild(taskName);
    taskElem.appendChild(editButton);
    taskElem.appendChild(deleteButton);
    taskElem.appendChild(priorityLabel);
    taskElem.appendChild(prioritySelect);
    taskElem.appendChild(deadlineLabel);
    taskElem.appendChild(deadlineInput);
    taskElem.appendChild(assignSelect);
    taskElem.appendChild(commentInput);
    taskElem.appendChild(commentButton);
    taskElem.appendChild(commentsList);

    taskList.appendChild(taskElem);
}



function editTask(task) {
    const newName = prompt('Введіть новий заголовок:', task.name);
    if (newName !== null && newName.trim() !== '') {
        task.name = newName.trim();
        const taskElem = document.querySelector(`.task[data-id="${task.id}"] .task-name`);
        if (taskElem) {
            taskElem.innerText = task.name;
        }
    }
}

function deleteTask(task) {
    tasks = tasks.filter(t => t.id !== task.id);
    const taskElem = document.querySelector(`.task[data-id="${task.id}"]`);
    if (taskElem) {
        taskElem.remove();
    }
}

function addComment(task, comment) {
    if (comment.trim() !== '') {
        task.comments.push(comment.trim());
        const commentsList = document.querySelector(`.task[data-id="${task.id}"] .comments-list`);
        if (commentsList) {
            const commentItem = document.createElement('li');
            commentItem.innerText = comment.trim();
            commentsList.appendChild(commentItem);
        }
    }
}

function sortTasks() {
    const taskList = document.getElementById('taskList');

    tasks.sort((a, b) => {
        const priorityOrder = { 'low': 1, 'normal': 2, 'high': 3 };

        if (priorityOrder[a.priority] < priorityOrder[b.priority]) return -1;
        if (priorityOrder[a.priority] > priorityOrder[b.priority]) return 1;

        if (a.deadline < b.deadline) return 1;
        if (a.deadline > b.deadline) return -1;

        return 0;
    });

    tasks.reverse();

       taskList.innerHTML = '';
    tasks.forEach(task => {
        renderTask(task);
    });
}

