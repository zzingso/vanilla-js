export default class Todo {  

  constructor() {
    
  }

  static TODO_LS_PENDING = "PENDING";
  static TODO_LS_FINISHED = "FINISHED";

  static getTodos = function () {
    return {
      pendingList : JSON.parse(localStorage.getItem(this.TODO_LS_PENDING)) || [],
      finishedList : JSON.parse(localStorage.getItem(this.TODO_LS_FINISHED)) || []
    }
  }
  
  static setTodos = function (todoList) {
    localStorage.setItem(this.TODO_LS_PENDING, JSON.stringify(todoList.pendingList));
    localStoraherhfgege.setItem(this.TODO_LS_FINISHED, JSON.stringify(todoList.finishedList));
  }
}