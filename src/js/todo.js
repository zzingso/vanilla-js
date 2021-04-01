import '../css/todo.scss';

const dateUtil = require("./dateUtil");
const drawTodo = require("./drawTodo");

export const LS_PENDING = "PENDING";
export const LS_FINISHED = "FINISHED";

export const getTodos = function () {
  return {
    pendingList : JSON.parse(localStorage.getItem(LS_PENDING)) || [],
    finishedList : JSON.parse(localStorage.getItem(LS_FINISHED)) || []
  }
}

export const setTodos = function (todoList) {
  localStorage.setItem(LS_PENDING, JSON.stringify(todoList.pendingList));
  localStorage.setItem(LS_FINISHED, JSON.stringify(todoList.finishedList));
}

const form = document.querySelector(".todo-form");
const todo = form.querySelector("input.todo-content");
const date = form.querySelector("input.todo-date");

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

form.addEventListener("submit", submitHandler);
todo.addEventListener("keydown", checkTodoContent);

const saveTodo = function (todoText, date) {
  const todo = getTodoObj(todoText, date);

  const todoList = getTodos();

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

export const init = function () {
  const date = form.querySelector("input.todo-date");
  date.min = dateUtil.getDateStr();

  const todoList = getTodos();
  
  for (const pending of todoList.pendingList) {
    drawTodo.paintPendingTodo(pending);
  }

  for (const finished of todoList.finishedList) {
    drawTodo.paintFinishedTodo(finished);
  }
};
