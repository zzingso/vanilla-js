import '../css/todo.scss';

import { paintPendingTodo, paintFinishedTodo } from "./drawTodo";
import DateUtil from "./dateUtil";
import TodoStorage from "./todoStorage";

const TODO_FORM = ".todo-form";
const TODO_FORM_CONTENT = ".todo-content";
const TODO_FORM_DATE = ".todo-date";

const form = document.querySelector(TODO_FORM);
const todoContent = form.querySelector(TODO_FORM_CONTENT);
const todoDate = form.querySelector(TODO_FORM_DATE);

const todoStorage = new TodoStorage();

let valid = false;

const submitHandler = function (event) {
  event.preventDefault();

  if(!valid) {
    return;
  }

  saveTodo(todoContent.value, todoDate.value);

  todoContent.value = "";
  todoDate.value = "";
};

const checkTodoContent = function(event) {
  const value = event.target.value;
  let div = form.querySelector("div.warning");

  if(div) {
    form.removeChild(form.firstChild);
  }

  if(event.key === "Escape") {
    valid = false;
    todoContent.value = "";
    return;
  }

  if(!value && event.key === "Enter") {
    div = document.createElement("div");
    div.innerText = "이 입력란을 작성하세요.";
    div.className = "warning";
    form.insertBefore(div, form.firstChild);
    valid =  false;
  } else {
    valid = true;
  }
}

const saveTodo = function (content, date) {
  const todo = getTodoObj(content, date);

  const todoList = todoStorage.getTodos();

  todoList.pendingList.push(todo);
  todoStorage.setTodos(todoList);

  drawTodo.paintPendingTodo(todo);
};

const getTodoObj = (content, date) => {
  return {
    id: Date.now().toString(),
    text: content,
    date: date,
  };
}

form.addEventListener("submit", submitHandler);
todoContent.addEventListener("keydown", checkTodoContent);

export const init = function () {
  todoDate.min = DateUtil.getDateStr();

  const todoList = todoStorage.getTodos();
  
  for (const pending of todoList.pendingList) {
    paintPendingTodo(pending);
  }

  for (const finished of todoList.finishedList) {
    paintFinishedTodo(finished);
  }
};
