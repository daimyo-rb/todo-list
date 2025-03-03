import "./styles.css";
import { greeting } from "./greeting.js";
// import { createTodo } from "./todo.js";

function createTodo (title, description, dueDate, label, notes, isDone, id=-1) {
    const toggleIsDone = function() {
        this.isDone = !this.isDone;    
    }
    return { title, description, dueDate, label, notes, isDone, id, toggleIsDone };
}

function createProject (name, id=-1) {
    let counter = 0;
    const todoList = new Array();
    const getTodoByIndex = (index) => {
        return todoList[index];
    }
    const getTodos = () => {
        return todoList;
    }
    const addTodo = (todo) => {
        todo.id = counter;
        counter += 1;
        todoList.push(todo);
    }
    const getTodoIndexById = (id) => {
        for (let i = 0; i < todoList.length; i++ ){
            if (todoList[i].id == id) {
                return i;
            }
        }
        console.log(`id: ${id} not found in project`);
    }
    const removeTodoById = (id) => {
        let index = getTodoIndexById(id);
        removeTodoByIndex(index);
    }
    const removeTodoByIndex = (index) => {
        todoList.splice(index, 1);
    }
    return { name, getTodos, addTodo, removeTodoById };
}

const stateManager = (function () {
    // multiple projects
        // each project has todos
    // logic for changing state
        // x create project
        // x delete project
        // x get projects
        // x add task
        // x delete task
        // x get tasks
    let counter = 0;
    const projectList = [];
    const getProjects = () => projectList;
    const createNewProject = (name) => {
        const newProject = createProject(name);
        newProject.id = counter;
        counter++;
        projectList.push(newProject);
    }
    const getProjectIndexById = (id) => {
        for (let i = 0; i < projectList.length; i++ ){
            if (projectList[i].id == id) {
                return i;
            }
        }
        console.log(`id: ${id} not found in projectList`);
    }
    const getProjectById = (id) => {
        let index = getProjectIndexById(id);
        return projectList[index];
    }
    const removeProjectById = (id) => {
        let index = getProjectIndexById(id);
        removeProjectByIndex(index);
    }
    const removeProjectByIndex = (index) => {
        projectList.splice(index, 1);
    }
    const getTodosByProjectObject = (project) => {
        return project.getTodos();
    }
    const getTodosByProjectId = (projectId) => {
        let project = getProjectById(projectId);
        return getTodosByProjectObject(project);
    }
    const addTodoByProjectObject = (todo, project) => {
        project.addTodo(todo);
    }
    const addTodoByProjectId = (todo, projectId) => {
        let project = getProjectById(projectId);
        return addTodoByProjectObject(todo, project);
    }
    const removeTodoByTodoIdProjectObject = (todoId, projectObj) => {
        projectObj.removeTodoById(todoId);
    }
    const removeTodoByTodoIdProjectId = (todoId, projectId) => {
        let project = getProjectById(projectId);
        removeTodoByTodoIdProjectObject(todoId, project);
    }
    return { getProjects, createNewProject, removeProjectById, getTodosByProjectId, addTodoByProjectId, removeTodoByTodoIdProjectId };
})();
console.log('display project list');
console.log(stateManager.getProjects());
console.log('creating new project')
stateManager.createNewProject('awesome'); // id = 0
console.log('display project list');
console.log(stateManager.getProjects());
console.log('get todos for project id==0')
console.log(stateManager.getTodosByProjectId(0))
console.log('add todo by project id==0');
stateManager.addTodoByProjectId(createTodo('mow lawn', 'cut the grass', '04/1/22', 'top priority', 'no notes', false), 0)
console.log('get todos for project id==0')
console.log(stateManager.getTodosByProjectId(0));
console.log('display project list');
console.log(stateManager.getProjects());
console.log('remove todo');
stateManager.removeTodoByTodoIdProjectId(0,0);
console.log('get todos for project id==0');
console.log(stateManager.getTodosByProjectId(0));