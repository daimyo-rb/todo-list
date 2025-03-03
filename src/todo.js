export function createTodo (title, description, dueDate, label, notes, isDone, id=-1) {
    const toggleIsDone = function() {
        this.isDone = !this.isDone;    
    }
    return { title, description, dueDate, label, notes, isDone, id, toggleIsDone };
}