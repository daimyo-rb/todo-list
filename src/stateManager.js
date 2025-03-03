import { createProject } from "./project.js";

export const stateManager = (function () {
    let counter = 0;
    let activeProjectId = 0;
    const projectList = [];
    const getProjects = () => projectList;
    const getActiveProject = () => {
        return getProjectById(activeProjectId);
    }
    const setActiveProjectId = (projectId) => {
        activeProjectId = projectId;
    }
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
    return { getActiveProject, setActiveProjectId, getProjects, createNewProject, removeProjectById, getTodosByProjectId, addTodoByProjectId, removeTodoByTodoIdProjectId };
})();