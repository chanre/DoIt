export default class project {
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
        if (!this.tasks.find(task => task.name === newTask.name)) 
            this.tasks.push(newTask);
    }

    getTasks() {
        return this.tasks;
    }

    getTask(task) {
        return this.tasks.find(task.getName());
    }
} 