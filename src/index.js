import "./styles.css";
import { createTodo } from "./todo.js";
import { stateManager } from "./stateManager.js";

console.log(stateManager);
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