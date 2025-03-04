import { createTodo } from "./todo.js";
import { stateManager } from "./stateManager.js";
export const screenController = (function (stateManager) {
    function populateDummyValues() {
         let projectOneId = 0;
        let projectTwoId = 1;
        stateManager.createNewProject('awesome'); // id = 0
        stateManager.createNewProject('sauce'); // id = 1
        stateManager.createNewProject('rocks'); // id =21
        for (let i = 0; i < 7; i++) {
            let taskName = `task${i}`;
            stateManager.addTodoByProjectId(createTodo(taskName, 'description', 'date', 'low priority', 'notes', true), projectOneId);    
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
    function buildModal(todoId=-1) {
        const hookElem = document.getElementById("container");
        if (todoId > 0){
            const todo = stateManager.getActiveProject().getTodoById(todoId);
        }
        const container = document.createElement('div');
        container.id = "todoModal";
        container.classList.add("modal");
        const content = `
        <div class="modal-content">
            <span id="closeModalBtn" class="close">&times;</span>
            <h2 class="modal-title"></h2>
            <form id="form-todo">
                <div class="form-item">
                    <label for="form-todo-title">Title:</label>
                    <input type="text" id="form-todo-title" name="title" required>
                </div>
                <div class="form-item">
                    <label for="form-todo-description">Description</label>
                    <input type="text" id="form-todo-description" name="description">
                </div>
                <div class="form-item">
                    <label for="form-todo-dueDate">Due Date</label>
                    <input type="date" id="form-todo-dueDate" name="dueDate">
                </div>
                <div class="form-item">
                    <label for="form-todo-label">Label</label>
                    <input type="text" id="form-todo-label" name="label" required>
                </div>
                <div class="form-item">
                    <label for="form-todo-notes">Notes</label>
                    <input type="textarea" id="form-todo-notes" name="notes">
                </div>
                <div class="form-item">
                    <label for="form-todo-isDone">Completed?</label>
                    <input type="checkbox" id="form-todo-isDone" name="isDone">
                </div>
                <input type="hidden" id="form-todo-todoId" name="todoId">
                <div class='form-btns'>
                    <button class="submit-todo-btn" type="submit"></button>
                </div>
            </form>
        </div>
        `
        container.innerHTML = content
        hookElem.appendChild(container);
    }
    function buildProjectElem(project) {
        let newBtn = document.createElement('button');
        newBtn.classList.add('project-btn'); 
        newBtn.textContent = project.name;
        newBtn.dataset.id = project.id;
        if (project.id == stateManager.getActiveProject().id){
            newBtn.classList.add('active-project');
        }
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
        todoElem.dataset.id = todo.id;
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
    function buildNewLabelColumn() {
        const newLabelColumnRoot = document.createElement('div');
        newLabelColumnRoot.classList.add('todo-column');
        const todoColumnHeader = document.createElement('div');
        todoColumnHeader.classList.add('todo-column-new-label')
        const newColumnButton = document.createElement('button');
        newColumnButton.classList.add('new-label-btn');
        newColumnButton.textContent = '+ new todo';
        todoColumnHeader.appendChild(newColumnButton);
        newLabelColumnRoot.appendChild(todoColumnHeader);
        return newLabelColumnRoot;
    }
    function displayTodosForProjectObj(projectObj){
        const hookElem = document.getElementsByClassName("todo-columns")[0];
        projectObj.getUniqueLabels().forEach(label => {
            hookElem.appendChild(buildTodoColumn(projectObj, label));
        });
        hookElem.appendChild(buildNewLabelColumn());
    }
    function displayTodos() {
        const activeProjectObj = stateManager.getActiveProject();
        displayTodosForProjectObj(activeProjectObj);
    }
    function updateScreen() {
        displayBase();
        displayProjects();
        displayTodos();
        buildModal();
    }
    function handleNewProjectName(value){
        if (value != 'enter name' && value != '') {
            let newProjectId = stateManager.createNewProject(value);
            stateManager.setActiveProjectId(newProjectId);
        }
        updateScreen();
        addMyEventListeners();    
    }
    function newProjectHandler(e) {
        let enterPressed = false;
        const bigNewProjectBtn = document.getElementsByClassName('new-project-btn-large')[0];
        const newProjectInput = document.createElement('input');
        newProjectInput.type = 'text';
        newProjectInput.value = 'enter name';
        newProjectInput.classList.add('new-project-input');
        bigNewProjectBtn.replaceWith(newProjectInput);
        newProjectInput.focus();
        newProjectInput.select();
        newProjectInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                enterPressed = true;
                handleNewProjectName(newProjectInput.value);
            }
        });
        newProjectInput.addEventListener('blur', (e) => {
            if (!enterPressed) {
                handleNewProjectName(newProjectInput.value);
            }
        });
    }
    function addNewProjectEventListeners() {
        const smallNewProjectBtn = document.getElementsByClassName('new-project-btn-small')[0];
        const largeNewProjectBtn = document.getElementsByClassName('new-project-btn-large')[0];
        smallNewProjectBtn.addEventListener('click', (e) => newProjectHandler(e));
        largeNewProjectBtn.addEventListener('click', (e) => newProjectHandler(e));
    }
    function changeActiveProjectHandler(e) {
        let clickedProjectId = e.target.dataset.id;
        if (clickedProjectId == stateManager.getActiveProject().id) {
            return
        }
        stateManager.setActiveProjectId(clickedProjectId);
        updateScreen();
        addMyEventListeners();
    }
    function addChangeActiveProjectEventListeners() {
        const projectBtns = document.getElementsByClassName("project-btn");
        Array.from(projectBtns).forEach((project) => {
            project.addEventListener('click', (e) => {
                changeActiveProjectHandler(e);
            });
        });
    }
    function updateTodoFromForm(formData) {
        const todo = stateManager.getActiveProject().getTodoById(formData.get('todoId'));
        todo.title = formData.get('title');
        todo.description = formData.get('description');
        todo.dueDate = formData.get('dueDate');
        todo.label = formData.get('label');
        todo.notes = formData.get('notes');
        todo.isDone = (formData.get('isDone') == 'on') ? true : false;
    }
    function createTodoFromForm(formData){
        const title = formData.get('title');
        const description = formData.get('description');
        const dueDate = formData.get('dueDate');
        const label = formData.get('label');
        const notes = formData.get('notes');
        const isDone = (formData.get('isDone') == 'on') ? true : false;
        const newTodo = createTodo(title, description, dueDate, label, notes, isDone);
        return newTodo;
    }
    function handleFormSubmission() {
        const form = document.getElementById('form-todo');
        const formData = new FormData(form);
        const isEdit = (Number(formData.get('todoId')) > -1) ? true : false;
        if (isEdit) { // depending on edit vs create perform logic
            updateTodoFromForm(formData);
        } else {
            const newTodo = createTodoFromForm(formData);
            stateManager.getActiveProject().addTodo(newTodo);
        }
        form.reset();
        updateScreen();
        addMyEventListeners();
    }
    function getModalRoot() {
        return document.getElementsByClassName('modal')[0];
    }
    function openModal(){
        getModalRoot().style.display = 'block';
    }
    function setModalLabels(e, isEditTodo) {
        const modalTitle = document.getElementsByClassName('modal-title')[0];
        const modalSubmit = document.getElementsByClassName('submit-todo-btn')[0];
        modalTitle.textContent = isEditTodo ? 'Edit ToDo' : 'Create New ToDo!';
        modalSubmit.textContent = isEditTodo ? 'Save Changes' : 'Create New ToDo';
    }
    function populateFormFromTodo(e, isEditTodo){
        if (isEditTodo) { // pre-populate form fields
            const todo = stateManager.getActiveProject().getTodoById(e.target.dataset.id);
            document.getElementById('form-todo-title').value = todo.title;
            document.getElementById('form-todo-description').value = todo.description;
            document.getElementById('form-todo-dueDate').value = todo.dueDate;
            document.getElementById('form-todo-label').value = todo.label;
            document.getElementById('form-todo-notes').value = todo.notes;
            document.getElementById('form-todo-isDone').checked = todo.isDone ? true : false;
        } else {
            document.getElementById('form-todo-title').value = '';
            document.getElementById('form-todo-description').value = '';
            document.getElementById('form-todo-dueDate').value = '';
            document.getElementById('form-todo-label').value = '';
            document.getElementById('form-todo-notes').value = '';
            document.getElementById('form-todo-isDone').checked = false;
        }
    }
    function setFormModeIndicator(e, isEditTodo) {
        const todoIdField = document.getElementById('form-todo-todoId');
        if (isEditTodo) {
            const todo = stateManager.getActiveProject().getTodoById(e.target.dataset.id);
            todoIdField.value = todo.id;
        } else {
            todoIdField.value = -1;
        }
    }
    function addFormDeleteButton(e, isEditTodo) {
        if (!isEditTodo) return;
        const todoId = e.target.dataset.id;
        const btnContainer = document.getElementsByClassName('form-btns')[0];
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.classList.add('delete-todo-btn');
        deleteButton.innerText = 'Delete ToDo';
        deleteButton.dataset.id = todoId;
        btnContainer.appendChild(deleteButton);
        return deleteButton;
    }
    function handleDeleteBtnClick(e) {
        const todoId = e.target.dataset.id;
        stateManager.getActiveProject().removeTodoById(todoId);
        document.getElementById('form-todo').reset();
        updateScreen();
        addMyEventListeners();
    }
    function handleFormDeleteButton(e, isEditTodo) {
        const deleteTodoBtn = document.getElementsByClassName('delete-todo-btn')[0];
        if (deleteTodoBtn && !isEditTodo){
            deleteTodoBtn.remove();
        }
        if (!isEditTodo) {
            return;
        }
        const deleteButton = addFormDeleteButton(e, isEditTodo);
        deleteButton.addEventListener('click', (e) => {
            handleDeleteBtnClick(e);
        })
    }
    function handleOpenModal(e) {
        const isEditTodo = (e.target.classList.contains('todo-item') ? true : false );
        setModalLabels(e, isEditTodo);
        populateFormFromTodo(e, isEditTodo);
        setFormModeIndicator(e, isEditTodo);
        handleFormDeleteButton(e, isEditTodo);
        openModal();
    }
    function closeModal(){
        getModalRoot().style.display = 'none';
    }
    function addInternalModalEventListeners() {
        const closeModalBtn = document.getElementsByClassName("close")[0];
        const modal = document.getElementById('todoModal');
        const form = document.getElementById('form-todo');
        closeModalBtn.addEventListener('click', () => {
            closeModal();
        })
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmission(e);
        });
        // wire up deleteTodo
    }
    function addExternalEventListeners() {
        const smallAddTodos = document.getElementsByClassName('new-todo-btn-small');
        const largeAddTodos = document.getElementsByClassName('new-todo-btn-large');
        const newColumnTodoBtn = document.getElementsByClassName('new-label-btn');
        const todos = document.getElementsByClassName('todo-item');
        const allTargetElems = [...smallAddTodos, ...largeAddTodos, ...newColumnTodoBtn, ...todos]
        allTargetElems.forEach((elem) => {
            elem.addEventListener('click', (e) => {
                handleOpenModal(e);
            });
        })
    }
    function addModalEventListeners(){
        addInternalModalEventListeners();
        addExternalEventListeners();
    }
    function addMyEventListeners() {
        addNewProjectEventListeners();
        addChangeActiveProjectEventListeners();
        addModalEventListeners();
    }
    populateDummyValues();
    updateScreen();
    addMyEventListeners();
    return { updateScreen, displayBase, displayProjects, displayTodos };
})(stateManager);