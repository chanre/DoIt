export default class Task {
    constructor(name, dueDate, details, priority) {
        this.name = name;
        this.dueDate = dueDate;
        this.details = details;
        this.priority = priority;
    }

    setDate(dueDate) {
        this.dueDate = dueDate;
    }

    getDate() {
        return this.dueDate;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setDetails(details) {
        this.details = details;
    }

    getDetails() {
        return this.details;
    }

    setPriority(priority) {
        this.priority = priority;
    }

    getPriority() {
        return this.priority;
    }
}