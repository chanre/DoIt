import Project from './project';
import Task from './task';
import ToDos from './todo';
import {format, parse} from 'date-fns';
import '../style.css';

// Initialize variables
const homeBtn = document.querySelector('#home');
const newTaskBtn = document.querySelector('#newTask');
const taskModal = document.querySelector('#taskModal');
const closeModal = document.querySelector('#closeModal');
const taskForm = document.querySelector('#task');
const addTask = document.querySelector('#addTask');
const formTitle = document.getElementById('title');
const formDetails = document.getElementById('details');
const formDate = document.getElementById('date');
const priority = document.getElementById('priority');
const invalidInput = document.getElementById('invalid');
const titleDiv = document.getElementById('titleDiv')

// Initialize todo list with example or from local storage
let toDoList = new ToDos();

if (localStorage.getItem('toDoList') === null) {
    toDoList.addProject(
        {
            name: 'Example Project',
            tasks: [
                {
                    name: 'Example Task #1',
                    dueDate: format(new Date(), 'yyyy-MM-dd'),
                    details: 'Here are details about what this task may entail.',
                    priority: 'High',
                }
            ]
        }
    )
    toDoList.addTask(
        {
            name: 'Example Task #2',
            dueDate: format(new Date(), 'yyyy-MM-dd'),
            details: 'Here are details about what this task may entail.',
            priority: 'High',
        }
    )
} else {
    // Retrieve todo list and set prototype to get methods back, parsing only sets it as plain object
    toDoList = JSON.parse(localStorage.getItem('toDoList'));
    Object.setPrototypeOf(toDoList, ToDos.prototype);
    titleDiv.textContent = 'Home';
    toDoList.projects.forEach((project) => {
        project.tasks.forEach((task) => displayTask(task));
    });
    toDoList.tasks.forEach((task) => {
        displayTask(task);
    });
}

function displayTask(task) {
    const tasksDiv = document.getElementById('tasksDiv');
    const newTask = document.createElement('div');
    const checkbox = document.createElement('i');
    const taskName = document.createElement('p');
    const taskDate = document.createElement('p');
    const taskEdit = document.createElement('i');
    const taskTrash = document.createElement('i');

    newTask.classList.add('task');
    checkbox.classList.add('fa-regular', 'fa-square');
    taskName.textContent = task.name;
    taskDate.textContent = format(parse(task.dueDate, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy');
    taskEdit.classList.add('fa-regular', 'fa-pen-to-square');
    taskTrash.classList.add('fa-solid', 'fa-trash');

    newTask.appendChild(checkbox);
    newTask.appendChild(taskName);
    newTask.appendChild(taskDate);
    newTask.appendChild(taskEdit);
    newTask.appendChild(taskTrash);

    tasksDiv.append(newTask);

    taskEdit.addEventListener('click', (e) => {
        let form = [formTitle, formDetails, formDate, priority];
        taskForm.reset();
        for (let x of form) {
            x.classList.remove('form-invalid');
            x.classList.remove('form-valid');
        }
        formTitle.value = task.name;
        formDetails.textContent = task.details;
        formDate.value = task.dueDate;
        priority.value = task.priority;
        taskModal.style.visibility = 'visible';
    });
    
    taskTrash.addEventListener('click', (e) => {
        const projects = toDoList.projects;
        const loneTasks = toDoList.tasks;

        if (loneTasks.includes(task)) {
            loneTasks.splice(loneTasks.indexOf(task), 1);
        } else {
            projects.forEach((project) => {
                if (project.includes(task)) {
                    project.splice(project.indexOf(task), 1);
                }
            });
        }
        
        localStorage.setItem('toDoList', JSON.stringify(toDoList));
        clearTasks();
        toDoList.projects.forEach((project) => {
            project.tasks.forEach((task) => displayTask(task));
        });
        toDoList.tasks.forEach((task) => {
            displayTask(task);
        });
    });

    console.log(`'task: ${task.name}' dueDate: ${(task.dueDate)}`)
}

function clearTasks() {
    const tasksDiv = document.getElementById('tasksDiv');
    tasksDiv.textContent = '';
}

homeBtn.addEventListener('click', (e) => {
    const {target} = e;
    clearTasks();
    titleDiv.textContent = 'Home';
    if (!target.classList.contains('active')) {
        toDoList.projects.forEach((project) => {
            project.tasks.forEach((task) => displayTask(task));
        });
        toDoList.tasks.forEach((task) => {
            displayTask(task);
        });
    }
});

newTaskBtn.addEventListener('click', (e) => {
    let form = [formTitle, formDetails, formDate, priority];
    taskForm.reset();
    for (let x of form) {
        x.classList.remove('form-invalid');
        x.classList.remove('form-valid');
    }
    taskModal.style.visibility = 'visible';
});

taskModal.addEventListener('click', (e) => {
    if (e.target.id == 'taskModal' && taskModal.style.visibility == 'visible') {
        taskModal.style.visibility = 'hidden';
        invalidInput.style.visibility = 'hidden';
    }
});

closeModal.addEventListener('click', (e) => {
    taskModal.style.visibility = 'hidden';
    invalidInput.style.visibility = 'hidden';
});

addTask.addEventListener('click', (e) => {
    let form = [formTitle, formDetails, formDate, priority];
    const newTask = new Task;

    if (formTitle.value && formDetails.value && formDate.value && priority.value) {
        invalidInput.style.visibility = 'hidden';
        newTask.name = formTitle.value;
        newTask.details = formDetails.value;
        newTask.dueDate = format(formDate.value, 'yyyy-MM-dd');
        newTask.priority = priority.value;

        toDoList.addTask(newTask);
        
        localStorage.setItem('toDoList', JSON.stringify(toDoList));
        taskModal.style.visibility = 'hidden';
        invalidInput.style.visibility = 'hidden';
        clearTasks();
        toDoList.projects.forEach((project) => {
            project.tasks.forEach((task) => displayTask(task));
        });
        toDoList.tasks.forEach((task) => {
            displayTask(task);
        })

    } else {
        for (let x of form) {
            if (!x.value) {
                invalidInput.style.visibility = 'visible';
                x.classList.add('form-invalid');
            } else {
                x.classList.add('form-valid');
            }
        }
    }
    
});