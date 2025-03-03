export function createProject (name, id=-1) {
    let counter = 0;
    const todoList = new Array();
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
    return { name, getTodos, getTodoById, addTodo, removeTodoById };
}