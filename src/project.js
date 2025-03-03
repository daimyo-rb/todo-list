export function createProject (name, id=-1) {
    id = id;
    let counter = 0;
    const todoList = new Array();
    const getUniqueLabels = () => {
        return new Set(todoList.map(todo => todo.label));
    }
    const getTodosWithLabel = (label) => {
        return todoList.filter(todo => todo.label === label);
    }
    const getTodos = () => {
        return todoList;
    }
    const getTodoIndexById = (id) => {
        for (let i = 0; i < todoList.length; i++ ){
            if (todoList[i].id == id) {
                return i;
            }
        }
        console.log(`id: ${id} not found in project`);
    }
    const getTodoById = (id) => {
        let index = getTodoIndexById(id);
        return todoList[index];
    }
    const addTodo = (todo) => {
        todo.id = counter;
        counter += 1;
        todoList.push(todo);
    }
    const removeTodoByIndex = (index) => {
        todoList.splice(index, 1);
    }
    const removeTodoById = (id) => {
        let index = getTodoIndexById(id);
        removeTodoByIndex(index);
    }
    return { name, getTodos, getUniqueLabels, getTodosWithLabel, getTodoById, addTodo, removeTodoById };
}