import Project from './project';
import Task from './task';
export default class toDos {
    constructor() {
        this.projects = [];
        this.tasks = [];
    }

    addProject(project) {
        this.projects.push(project);
    }

    deleteProject(project) {
        this.projects.splice(this.projects.indexOf(project), 1);
    }

    getProject(project) {
        return this.projects.find(object => object.name === project);
    }
    
    addGenericTask(task) {
        this.tasks.push(task);
    }

    deleteTask(task) {
        this.tasks.splice(this.tasks.findIndex(task));
    }

    getTask(task) {
        return this.tasks.find(task);
    }
}
