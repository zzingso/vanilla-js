export default class TodoStorage {  

  constructor() {
    this.TODO_LS_PENDING = "PENDING";
    this.TODO_LS_FINISHED = "FINISHED";
  }

  getTodos = () => {
    console.log(this.TODO_LS_PENDING);
    return {
      pendingList : JSON.parse(localStorage.getItem(this.TODO_LS_PENDING)) || [],
      finishedList : JSON.parse(localStorage.getItem(this.TODO_LS_FINISHED)) || []
    }
  }
  
  setTodos = (todoList) => {
    localStorage.setItem(this.TODO_LS_PENDING, JSON.stringify(todoList.pendingList));
    localStorage.setItem(this.TODO_LS_FINISHED, JSON.stringify(todoList.finishedList));
  }
}