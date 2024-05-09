import Project from './project';
import Task from './task';
import ToDos from './todo';
import {format} from 'date-fns';
import '../style.css';
import project from './project';

let toDoList = new ToDos();

if (localStorage.getItem('toDoList') === null) {
    toDoList.addProject(
        {
            name: 'Example Project',
            tasks: [
                {
                    name: 'Example Task #1',
                    dueDate: function() {
                        format(new Date(), 'yyyy-MM-dd');
                    },
                    details: 'Here are details about what this task may entail.',
                    priority: 'High',
                }
            ]
        }
    )
    toDoList.addTask(
        {
            name: 'Example Task #2',
            dueDate: function() {
                format(new Date(), 'yyyy-MM-dd');
            },
            details: 'Here are details about what this task may entail.',
            priority: 'High',
        }
    )
}
    
const homeBtn = document.querySelector('#home');

homeBtn.addEventListener('click', (e) => {
    const {target} = e;
    if (!target.classList.contains('active')) {
        toDoList.projects.forEach((project) => {
            project.tasks.forEach((task) => displayTask(task));
        });
        toDoList.tasks.forEach((task) => {
            displayTask(task);
        });
    }
});

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
    taskDate.textContent = task.date;
    taskEdit.classList.add('fa-regular', 'fa-pen-to-square');
    taskTrash.classList.add('fa-solid', 'fa-trash');

    newTask.appendChild(checkbox);
    newTask.appendChild(taskName);
    newTask.appendChild(taskDate);
    newTask.appendChild(taskEdit);
    newTask.appendChild(taskTrash);

    tasksDiv.append(newTask);
}