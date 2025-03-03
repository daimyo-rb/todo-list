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
    function displayHTML(hookElem, content){
        hookElem.innerHTML = content;
    }
    function displayBase() { 
        const hookElem = document.getElementById("container");
        const content = `
        <div class="sidebar">
            <div class="sidebar-header"></div>
            <div class="sidebar-main"></div>
            <div class="sidebar-footer"></div>
        </div>
        <div class="right-wrapper">
            <div class="todo-columns"></div>
        </div>
        `
        displayHTML(hookElem, content);
    }
    function buildProjectHTMLString() {
        const projectList = document.createElement("div");
        projectList.classList.add("project-list")
        const newProjBtn = document.createElement("button");
        newProjBtn.classList.add("project-btn");
        stateManager.getProjects().forEach(project => {
          let newBtn = document.createElement('button');
          newBtn.classList.add('project-btn'); 
          newBtn.textContent = project.name;
          projectList.appendChild(newBtn);
        });
        return projectList.outerHTML;
    }
    function displayProjects() {
        const hookElem = document.getElementsByClassName("sidebar-main")[0];
        const content = buildProjectHTMLString();
        displayHTML(hookElem, content);
    }
    function buildTodoColumn(projectObj, label) {
        const curTodoColumnRoot = document.createElement('div');
        curTodoColumnRoot.classList.add('todo-column');
        const todoColumnLabel = document.createElement('div');
        todoColumnLabel.classList.add('todo-column-label');
        todoColumnLabel.textContent = label;
        curTodoColumnRoot.appendChild(todoColumnLabel);
        const todoItemContainer = document.createElement('div');
        todoItemContainer.classList.add('todo-item-container');
        projectObj.getTodosWithLabel(label).forEach(todo => {
            const todoElem = document.createElement('button');
            todoElem.classList.add('todo-item');
            todoElem.textContent = todo.title;
            todoItemContainer.appendChild(todoElem);
        });
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