export default class toDos {
    constructor() {
        this.projects = [];
        this.projects.push('Home');
        this.projects.push('Today');
        this.projects.push('This Week');
    }

    addProject(project) {
        this.projects.push(project);
    }

    deleteProject(project) {
        this.projects.splice(this.projects.findIndex(project));
    }

    getProject(project) {
        return this.projects.find(project);
    }
    
}