import Project from './project';
import Task from './task';
import ToDos from './todo';
import {format, differenceInDays, parseISO} from 'date-fns';
import '../style.css';

// Initialize variables
const homeBtn = document.querySelector('#home');
const todayBtn = document.getElementById('today');
const weekBtn = document.getElementById('week');
const newTaskBtn = document.querySelector('#newTask');
const modal = document.querySelector('#modal');
const closeModal = document.getElementsByClassName('closeModal');
const taskForm = document.querySelector('#task');
const projectForm = document.querySelector('#project');
const editForm = document.querySelector('#edit');
const addTask = document.querySelector('#addTask');
const editTask = document.querySelector('#editTask');
const formTitle = document.getElementById('title');
const formDetails = document.getElementById('details');
const formDate = document.getElementById('date');
const priority = document.getElementById('priority');
const editTitle = document.getElementById('editTitle');
const editDetails = document.getElementById('editDetails');
const editDate = document.getElementById('editDate');
const editPriority = document.getElementById('editPriority');
const invalidInput = document.getElementById('invalid');
const titleDiv = document.getElementById('titleDiv')
const newProject = document.getElementById('newProject')
const addProject = document.getElementById('addProject');
const projectTitle = document.getElementById('projectTitle');
const sortByDate = (a, b) => { return (a.dueDate < b.dueDate) ? -1 : ((a.dueDate > b.dueDate) ? 1 : 0)};

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
        Object.setPrototypeOf(project, Project.prototype);
        project.tasks.forEach((task) => {
            Object.setPrototypeOf(task, Task.prototype);
            displayTask(task);
        });
    });
    toDoList.tasks.forEach((task) => {
        Object.setPrototypeOf(task, Task.prototype);
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
    function strikethrough(current) {
        if(!current.classList.contains('complete')) {
            task.complete = true;
            newTask.classList.toggle('complete');
            checkbox.classList.remove('fa-square', 'fa-regular');
            checkbox.classList.add('fa-square-check', 'fa-solid');  
        } else { 
            task.complete = false;
            newTask.classList.toggle('complete');
            checkbox.classList.add('fa-square', 'fa-regular');
            checkbox.classList.remove('fa-square-check', 'fa-solid'); 
        }   
        localStorage.setItem('toDoList', JSON.stringify(toDoList));
    }

    newTask.classList.add('task');
    checkbox.classList.add('fa-regular', 'fa-square');
    taskName.textContent = task.name;
    taskDate.textContent = format(task.dueDate, 'PPP');
    taskEdit.classList.add('fa-regular', 'fa-pen-to-square');
    taskTrash.classList.add('fa-solid', 'fa-trash');

    newTask.appendChild(checkbox);
    newTask.appendChild(taskName);
    newTask.appendChild(taskDate);
    newTask.appendChild(taskEdit);
    newTask.appendChild(taskTrash);

    tasksDiv.append(newTask);

    if (task.complete) { 
        newTask.classList.add('complete');
        checkbox.classList.remove('fa-square', 'fa-regular');
        checkbox.classList.add('fa-square-check', 'fa-solid');  
    } else {
        newTask.classList.remove('complete');
        checkbox.classList.add('fa-square', 'fa-regular');
        checkbox.classList.remove('fa-square-check', 'fa-solid'); 
    }

    newTask.addEventListener('click', (e) => {
        strikethrough(e.target); 
    });

    checkbox.addEventListener('click', (e) => {
        strikethrough(newTask);
        e.stopPropagation();
    });

    taskEdit.addEventListener('click', () => {
        let form = [editTitle, editDetails, editDate, editPriority];
        editForm.reset();
        for (let x of form) {
            x.classList.remove('form-invalid');
            x.classList.remove('form-valid');
        }
        const oldTaskName = task.name;
        editTitle.value = task.name;
        editDetails.textContent = task.details;
        editDate.value = task.dueDate;
        editPriority.value = task.priority;
        modal.style.visibility = 'visible';
        editForm.style.visibility = 'visible';

        editTask.addEventListener('click', () => {
            let form = [editTitle, editDetails, editDate, editPriority];
            if (editTitle.value && editDetails.value && editDate.value && editPriority.value) {
                if (titleDiv.textContent === 'Home') {
                    const index = toDoList.tasks.findIndex(item => item.name === oldTaskName);
                    toDoList.tasks[index].name = editTitle.value;
                    toDoList.tasks[index].details = editDetails.value;
                    toDoList.tasks[index].dueDate = editDate.value;
                    toDoList.tasks[index].priority = editPriority.value;
        
                    saveAndClear();
                } else {

                    return;
                }
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
    });
    
    taskTrash.addEventListener('click', () => {
        const projects = toDoList.projects;
        const loneTasks = toDoList.tasks;
        
        if (loneTasks.includes(task)) {
            loneTasks.splice(loneTasks.indexOf(task), 1);
        } else {
            projects.forEach((project) => {
                if (project.tasks.includes(task)) {
                    project.tasks.splice(project.tasks.indexOf(task), 1);
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
}

function clearTasks() {
    const tasksDiv = document.getElementById('tasksDiv');
    tasksDiv.textContent = '';
}

function clearProjects(projectList) {
    while(projectList.firstChild) {
        projectList.removeChild(projectList.firstChild);
    }
    projectList.textContent = "Projects";
}

function refreshProjectsSelect() {
    const projectToAddTo = document.getElementById('projects');

    while(projectToAddTo.firstChild) {
        projectToAddTo.removeChild(projectToAddTo.firstChild);
    }

    const none = document.createElement('option');
    none.value = 'None';
    none.text = 'None';
    projectToAddTo.appendChild(none);

    for (let i = 0; i < toDoList.projects.length; i++) {
        let option = document.createElement('option');
        option.value = toDoList.projects[i].name;
        option.text = toDoList.projects[i].name;
        projectToAddTo.appendChild(option);
    }
}

function displayProjects() {
    const projectList = document.getElementById('projectList');

    refreshProjectsSelect();
    clearProjects(projectList);

    toDoList.projects.forEach((project) => {
        const projectListItem = document.createElement('li');
        const deleteProject = document.createElement('span');
        
        deleteProject.textContent = '\u00d7';
        projectListItem.textContent = project.name;
        projectListItem.appendChild(deleteProject);
        deleteProject.addEventListener('click', () => {
            toDoList.deleteProject(project);
            localStorage.setItem('toDoList', JSON.stringify(toDoList));
            displayProjects();
        });
        projectListItem.addEventListener('click', () => {
            titleDiv.textContent = project.name;
            clearTasks();
            homeBtn.classList.remove('active');
            todayBtn.classList.remove('active');
            weekBtn.classList.remove('active');
            project.tasks.forEach((task) => {
                displayTask(task);
            });
        });
        projectList.appendChild(projectListItem);
    });
}

function saveAndClear(currentProject) {
    localStorage.setItem('toDoList', JSON.stringify(toDoList));
    modal.style.visibility = 'hidden';
    taskForm.style.visibility = 'hidden';
    projectForm.style.visibility = 'hidden';
    editForm.style.visibility = 'hidden';
    invalidInput.style.visibility = 'hidden';
    clearTasks();

    switch(currentProject) {
        case 'Home':
            toDoList.projects.forEach((project) => {
                project.tasks.sort(sortByDate);
                project.tasks.forEach((task) => displayTask(task));
            });
            toDoList.tasks.sort(sortByDate);
            toDoList.tasks.forEach((task) => {
                displayTask(task);
            })
            break;
        case 'Today':
            displayToday();
            break;
        case 'This Week':
            displayThisWeek;
            break;
        default:
            const index = toDoList.projects.findIndex(project => project.name === currentProject);
            toDoList.projects[index].sort(sortByDate);
            toDoList.projects[index].tasks.forEach((task) => {
                displayTask(task);
            });
    }
}

function displayToday() {
    toDoList.projects.forEach((project) => {
        project.tasks.forEach((task) => {
            project.tasks.sort(sortByDate);
            if (Math.abs(differenceInDays(task.dueDate, new Date())) === 0) {
                displayTask(task);
            }
        });
    });
    toDoList.tasks.forEach((task) => {
        toDoList.tasks.sort(sortByDate);
        if (Math.abs(differenceInDays(task.dueDate, new Date())) === 0) {
            displayTask(task);
        }
    });
}

function displayThisWeek() {
    toDoList.projects.forEach((project) => {
        project.tasks.forEach((task) => {
            project.tasks.sort(sortByDate);
            if (Math.abs(differenceInDays(task.dueDate, new Date())) <= 7) {
                displayTask(task);
            }
        });
    });
    toDoList.tasks.forEach((task) => {
        toDoList.tasks.sort(sortByDate);
        if (Math.abs(differenceInDays(task.dueDate, new Date())) <= 7) {
            displayTask(task);
        }
    });
}

homeBtn.addEventListener('click', (e) => {
    const {target} = e;
    titleDiv.textContent = 'Home';
    if (!target.classList.contains('active')) {
        clearTasks();
        homeBtn.classList.add('active');
        todayBtn.classList.remove('active');
        weekBtn.classList.remove('active');

        toDoList.projects.forEach((project) => {
            project.tasks.sort(sortByDate);
            project.tasks.forEach((task) => {
                displayTask(task)
            });
        });

        toDoList.tasks.sort(sortByDate);
        toDoList.tasks.forEach((task) => {
            displayTask(task);
        });

    } 
});

todayBtn.addEventListener('click', (e) => {
    const {target} = e;
    titleDiv.textContent = 'Today';
    if (!target.classList.contains('active')) {
        clearTasks();
        todayBtn.classList.add('active');
        weekBtn.classList.remove('active');
        homeBtn.classList.remove('active');
        displayToday();
    }
});

weekBtn.addEventListener('click', (e) => {
    const {target} = e;
    titleDiv.textContent = 'This Week';
    if (!target.classList.contains('active')) {
        clearTasks();
        weekBtn.classList.add('active');
        homeBtn.classList.remove('active');
        todayBtn.classList.remove('active');
        displayThisWeek();
    }
});

newTaskBtn.addEventListener('click', (e) => {
    let form = [formTitle, formDetails, formDate, priority];
    taskForm.reset();
    formDetails.value = '';
    for (let x of form) {
        x.classList.remove('form-invalid');
        x.classList.remove('form-valid');
    }
    modal.style.visibility = 'visible';
    taskForm.style.visibility = 'visible';
});

modal.addEventListener('click', (e) => {
    if (e.target.id == 'modal' && modal.style.visibility == 'visible') {
        modal.style.visibility = 'hidden';
        projectForm.style.visibility = 'hidden';
        taskForm.style.visibility = 'hidden';
        editForm.style.visibility = 'hidden';
        invalidInput.style.visibility = 'hidden';
    }
});

for (let element of closeModal) {
    element.addEventListener('click', () => {
        taskForm.style.visibility = 'hidden';
        projectForm.style.visibility = 'hidden';
        editForm.style.visibility = 'hidden';
        modal.style.visibility = 'hidden';
        invalidInput.style.visibility = 'hidden';
    });
}

addTask.addEventListener('click', (e) => {
    let form = [formTitle, formDetails, formDate, priority];
    const newTask = new Task;
    const projectOptions = document.getElementById('projects');

    if (formTitle.value && formDetails.value && formDate.value && priority.value) {
        invalidInput.style.visibility = 'hidden';
        newTask.name = formTitle.value;
        newTask.details = formDetails.value;
        newTask.dueDate = parseISO(formDate.value);
        newTask.priority = priority.value;
        const currentProject = titleDiv.textContent;

        if (projectOptions.value != 'None') {
            const index = toDoList.projects.findIndex(project => project.name === projectOptions.value);
            toDoList.projects[index].addTask(newTask);
        } else {
            toDoList.addGenericTask(newTask);
        }
        
        saveAndClear(currentProject);

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

newProject.addEventListener('click', (e) => {
    modal.style.visibility = 'visible';
    projectForm.style.visibility = 'visible';
});

addProject.addEventListener('click', () => {
    const newProject = new Project;
    
    newProject.name = projectTitle.value;
    toDoList.addProject(newProject);
    localStorage.setItem('toDoList', JSON.stringify(toDoList));
    modal.style.visibility = 'hidden';
    projectForm.style.visibility = 'hidden';

    displayProjects();
});

displayProjects();