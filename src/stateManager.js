import { createProject } from "./project.js";
import { createTodo } from "./todo.js";

export const stateManager = (function () {
    let counter = 0;
    let activeProjectId = 0;
    const projectList = [];
    const loadStateManagerState = () => {
        if (localStorage.getItem('state') !== null) {
            let state = JSON.parse(localStorage.getItem('state'));
            counter = state.counter;
            activeProjectId = state.activeProjectId;
            state.projectList.forEach(project => {
                let newProject = createProject(project.name, project.id);
                newProject.setCounter(project.counter);
                newProject.setProjectId(project.id);
                let tempList = [];
                // newProject.todoList = [];
                project.todoList.forEach(todo => {
                    let newTodo = createTodo(todo.title, todo.description, todo.dueDate, todo.label, todo.notes, todo.isDone, todo.id)
                    tempList.push(newTodo);
                })
                newProject.setTodoList(tempList);
                projectList.push(newProject);
            })
        } else {
            console.log('key not found');
            console.log('populating dummy values');
            populateDummyValues();
        }
    }
    const getStateManagerState = () => {
        let stateObj = {}
        stateObj.counter = counter;
        stateObj.activeProjectId = activeProjectId;
        stateObj.projectList = []
        projectList.forEach((project) => {
            let projectObj = {}
            projectObj.name = project.name;
            projectObj.id = project.getProjectId();
            projectObj.counter = project.getCounter();
            projectObj.todoList = [];
            project.getTodos().forEach(todo => {
                let taskObj = {}
                taskObj.title = todo.title;
                taskObj.description = todo.description;
                taskObj.dueDate = todo.dueDate;
                taskObj.label = todo.label;
                taskObj.notes = todo.notes;
                taskObj.isDone = todo.isDone;
                taskObj.id = todo.id;
                projectObj.todoList.push(taskObj);
            })
            stateObj.projectList.push(projectObj);
        })
        return stateObj;
    }
    const dumpStateManagerState = () => {
        let stateObj = getStateManagerState();
        localStorage.setItem('state', JSON.stringify(stateObj));
    }
    const populateDummyValues = () => {
        let projectOneId = 0;
        let projectTwoId = 1;
        createNewProject('awesome'); // id = 0
        createNewProject('sauce'); // id = 1
        createNewProject('rocks'); // id = 2
        for (let i = 0; i < 7; i++) {
            let taskName = `task${i}`;
            addTodoByProjectId(createTodo(taskName, 'description', 'date', 'low priority', 'notes', true), projectOneId);    
        }
        for (let i = 7; i < 10; i++) {
            let taskName = `task${i}`;
            addTodoByProjectId(createTodo(taskName, 'description', 'date', 'high priority', 'notes', false), projectOneId);    
        }
        for (let i = 0; i < 5; i++) {
            let taskName = `task${i}`;
            addTodoByProjectId(createTodo(taskName, 'description', 'date', 'priority', 'notes', false), projectTwoId);    
        }
    }
    const getProjects = () => projectList;
    const getActiveProject = () => {
        return getProjectById(activeProjectId);
    }
    const setActiveProjectId = (projectId) => {
        activeProjectId = projectId;
    }
    const createNewProject = (name) => {
        const newProject = createProject(name);
        let newProjectId = counter
        newProject.setProjectId(newProjectId);
        counter++;
        projectList.push(newProject);
        return newProjectId;
    }
    const getProjectIndexById = (id) => {
        for (let i = 0; i < projectList.length; i++ ){
            if (projectList[i].getProjectId() == id) {
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
    // loadStateManagerState();
    return { dumpStateManagerState, loadStateManagerState, populateDummyValues, getActiveProject, setActiveProjectId, getProjects, createNewProject, removeProjectById, getTodosByProjectId, addTodoByProjectId, removeTodoByTodoIdProjectId };
})();