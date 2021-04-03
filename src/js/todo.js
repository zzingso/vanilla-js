import '../css/todo.scss';

import { paintPendingTodo, paintFinishedTodo } from "./drawTodo";
import { getDateStr } from "./dateUtil";
import TodoStorage from "./todoStorage";

const TODO_FORM = ".todo-form";
const TODO_FORM_CONTENT = ".todo-content";
const TODO_FORM_DATE = ".todo-date";

const form = document.querySelector(TODO_FORM);
const todo = form.querySelector(TODO_FORM_CONTENT);
const date = form.querySelector(TODO_FORM_DATE);

let valid = false;

const submitHandler = function (event) {
  event.preventDefault();

  if(!valid) {
    return;
  }

  saveTodo(todo.value, date.value);

  todo.value = "";
  date.value = "";
};

const checkTodoContent = function(event) {
  const value = event.target.value;
  let div = form.querySelector("div.warning");

  if(div) {
    form.removeChild(form.firstChild);
  }

  if(event.key === "Escape") {
    valid = false;
    todo.value = "";
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

const saveTodo = function (todoText, date) {
  const todo = getTodoObj(todoText, date);

  const todoList = TodoStorage.getTodos();

  todoList.pendingList.push(todo);
  setTodos(todoList);

  drawTodo.paintPendingTodo(todo);
};

const getTodoObj = (text, date) => {
  return {
    id: Date.now().toString(),
    text: text,
    date: date,
  };
}

form.addEventListener("submit", submitHandler);
todo.addEventListener("keydown", checkTodoContent);

export const init = function () {
  date.min = getDateStr();

  const todoList = TodoStorage.getTodos();
  
  for (const pending of todoList.pendingList) {
    paintPendingTodo(pending);
  }

  for (const finished of todoList.finishedList) {
    paintFinishedTodo(finished);
  }
};
