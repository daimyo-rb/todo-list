import "./styles.css";
import { createTodo } from "./todo.js";
import { stateManager } from "./stateManager.js";

function populateTestValues() {
    let projectOneId = 0;
    let projectTwoId = 1;
    stateManager.createNewProject('awesome'); // id = 0
    stateManager.createNewProject('sauce'); // id = 1
    stateManager.createNewProject('rocks'); // id =21
    for (let i = 0; i < 7; i++) {
        let taskName = `task${i}`;
        stateManager.addTodoByProjectId(createTodo(taskName, 'description', 'date', 'low priority', 'notes', false), projectOneId);    
    }
    for (let i = 7; i < 10; i++) {
        let taskName = `task${i}`;
        stateManager.addTodoByProjectId(createTodo(taskName, 'description', 'date', 'high priority', 'notes', false), projectOneId);    
    }
    for (let i = 0; i < 5; i++) {
        let taskName = `task${i}`;
        stateManager.addTodoByProjectId(createTodo(taskName, 'description', 'date', 'priority', 'notes', false), projectTwoId);    
    }
}

populateTestValues();

const screenController = (function (stateManager) {
    function displayBase() { 
        const hookElem = document.getElementById("container");
        const content = `
        <div class="sidebar">
            <div class="sidebar-header">
                <p>Your Projects</p>
                <button class="new-project-btn-small">+ new</button>
            </div>
            <div class="sidebar-main"></div>
            <div class="sidebar-footer"></div>
        </div>
        <div class="right-wrapper">
            <div class="todo-columns"></div>
        </div>
        `
        hookElem.innerHTML = content;
    }
    function buildProjectElem(project) {
        let newBtn = document.createElement('button');
        newBtn.classList.add('project-btn'); 
        newBtn.textContent = project.name;
        return newBtn;
    }
    function displayProjects() {
        const hookElem = document.getElementsByClassName("sidebar-main")[0];
        const projectList = document.createElement("div");
        projectList.classList.add("project-list")
        stateManager.getProjects().forEach(project => {
            const projectElem = buildProjectElem(project);
            projectList.appendChild(projectElem);
        });
        let addProjectBtn = document.createElement('button');
        addProjectBtn.classList.add('new-project-btn-large');
        addProjectBtn.textContent = "+ new project";
        projectList.appendChild(addProjectBtn);
        hookElem.appendChild(projectList);
    }
    function addTodoColumnHeader(root, label){
        const todoColumnHeader = document.createElement('div');
        todoColumnHeader.classList.add('todo-column-header');
        const todoColumnLabel = document.createElement('p');
        todoColumnLabel.textContent = label;
        todoColumnHeader.appendChild(todoColumnLabel);
        const newTodoBtn = document.createElement('button');
        newTodoBtn.classList.add('new-todo-btn-small');
        newTodoBtn.textContent = "+ new";
        todoColumnHeader.appendChild(newTodoBtn);
        root.appendChild(todoColumnHeader);
    }
    function addTodoElemToTodoContainer(container, todo){
        const todoElem = document.createElement('button');
        todoElem.classList.add('todo-item');
        todoElem.textContent = todo.title;
        container.appendChild(todoElem);
    }
    function addNewTaskButtonToTodoContainer(container) {
        const todoElem = document.createElement('button');
        todoElem.classList.add('new-todo-btn-large');
        todoElem.textContent = "+ new todo";
        container.appendChild(todoElem);
    }
    function buildTodoColumn(projectObj, label) {
        const curTodoColumnRoot = document.createElement('div');
        curTodoColumnRoot.classList.add('todo-column');
        addTodoColumnHeader(curTodoColumnRoot, label);
        const todoItemContainer = document.createElement('div');
        todoItemContainer.classList.add('todo-item-container');
        projectObj.getTodosWithLabel(label).forEach(todo => {
            addTodoElemToTodoContainer(todoItemContainer, todo);
        });
        addNewTaskButtonToTodoContainer(todoItemContainer);
        curTodoColumnRoot.appendChild(todoItemContainer);
        return curTodoColumnRoot;
        
    }
    function displayTodosForProjectObj(projectObj){
        const hookElem = document.getElementsByClassName("todo-columns")[0];
        projectObj.getUniqueLabels().forEach(label => {
            hookElem.appendChild(buildTodoColumn(projectObj, label));
        });
    }
    function displayTodos() {
        const activeProjectObj = stateManager.getActiveProject();
        displayTodosForProjectObj(activeProjectObj);
    }
    function updateScreen() {
        displayBase();
        displayProjects();
        displayTodos();
    }
    return { updateScreen, displayBase, displayProjects, displayTodos };
})(stateManager);

screenController.updateScreen();

// console.log(stateManager);
// console.log('display project list');
// console.log(stateManager.getProjects());
// console.log('creating new project')
// stateManager.createNewProject('awesome'); // id = 0
// console.log('display project list');
// console.log(stateManager.getProjects());
// console.log('get todos for project id==0')
// console.log(stateManager.getTodosByProjectId(0))
// console.log('add todo by project id==0');
// stateManager.addTodoByProjectId(createTodo('mow lawn', 'cut the grass', '04/1/22', 'top priority', 'no notes', false), 0)
// console.log('get todos for project id==0')
// console.log(stateManager.getTodosByProjectId(0));
// console.log('display project list');
// console.log(stateManager.getProjects());
// console.log('remove todo');
// stateManager.removeTodoByTodoIdProjectId(0,0);
// console.log('get todos for project id==0');
// console.log(stateManager.getTodosByProjectId(0));