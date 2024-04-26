export default class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    contains(task) {
        return this.tasks.find(task.getName());
    }

    setTasks(tasks) {
        this.tasks = tasks;
    }

    addTask(newTask) {
        if (!this.tasks.find(newTask.getName()) (this.tasks.push(newTask)));
    }

    getTasks() {
        return this.tasks;
    }

    getTask(task) {
        return this.tasks.find(task.getName());
    }
} 