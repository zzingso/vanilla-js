import TodoStorage from "./todoStorage";
import { paintPendingTodo, paintFinishedTodo } from "./drawTodo";

const todoStorage = new TodoStorage();

const BTN_TYPE_CANCEL = "cancel";
const BTN_TYPE_UPDATE = "update";
const BTN_TYPE_FINISH = "finish";
const BTN_TYPE_UNDO = "undo";

export default class TodoComponent {

  constructor(type) {
    this.type = type;
    this.TODO_BUTTON = "todo-button";
  }

  getButtonComponent = () => {
    switch(this.type) {
      case BTN_TYPE_CANCEL :
        return this.makeBtnCancel();
      case BTN_TYPE_UPDATE :
        return this.makeBtnUpdate();
      case BTN_TYPE_FINISH :
        return this.makeBtnFinish();
      case BTN_TYPE_UNDO :
        return this.makeBtnUndo();
      default :
        return new Error('I can\'t give you button');
    }
  }

  makeBtnFinish = function () {
    const btnFinish = document.createElement("button");
    btnFinish.innerText = "✅";
    btnFinish.className = this.TODO_BUTTON;
    btnFinish.addEventListener("click", this.finishTodo);
  
    return btnFinish;
  }
  
  makeBtnUpdate = function () {
    const btnUpdate = document.createElement("button");
    btnUpdate.innerText = "✏️";
    btnUpdate.className = this.TODO_BUTTON;
  
    return btnUpdate;
  }
  
  makeBtnCancel = function () {
    const btnCancel = document.createElement("button");
    btnCancel.innerText = "❌";
    btnCancel.className = this.TODO_BUTTON;
    btnCancel.addEventListener("click", this.cancelTodo);
  
    return btnCancel;
  }
  
  makeBtnUndo = function () {
    const btnUndo = document.createElement("button");
    btnUndo.innerText = "⏪";
    btnUndo.className = this.TODO_BUTTON;
    btnUndo.addEventListener("click", this.undoTodo);
  
    return btnUndo;
  }

  cancelTodo = (event) => {
    const todoList = todoStorage.getTodos();
  
    const id = event.target.parentNode.id;
    todoList.pendingList = todoList.pendingList.filter((x) => x.id !== id);
  
    todoStorage.setTodos(todoList);
    this.deleteTodo(event.target.parentNode);
  }
  
  finishTodo = (event) => {
    const todoList = todoStorage.getTodos();
  
    const id = event.target.parentNode.id;
    const finishedTodo = todoList.pendingList.find((x) => x.id === id);
    todoList.pendingList = todoList.pendingList.filter((x) => x.id !== id);
  
    todoList.finishedList.push(finishedTodo);
  
    todoStorage.setTodos(todoList);
    this.deleteTodo(event.target.parentNode);
    paintFinishedTodo(finishedTodo);
  }
  
  undoTodo = (event) => {
    const todoList = todoStorage.getTodos();
  
    const id = event.target.parentNode.id;
    const undoTodo = todoList.finishedList.find((x) => x.id === id);
    todoList.finishedList = todoList.finishedList.filter((x) => x.id !== id);
  
    todoList.pendingList.push(undoTodo);
  
    todoStorage.setTodos(todoList);
    this.deleteTodo(event.target.parentNode);
    paintPendingTodo(undoTodo);
  }

  deleteTodo = (target) => {
    target.parentNode.removeChild(target);
  };
}