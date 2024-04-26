import Project from './project';
import Task from './task';
import ToDos from './todo';

if (!localStorage.getItem('toDoList')) {
    let toDoList = new ToDos();
}
