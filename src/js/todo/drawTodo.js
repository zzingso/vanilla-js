import TodoStorage from "./todoStorage";
import DateUtil from "../dateUtil";
import TodoComponent from "./todoComponent";


const PENDING_TODO = "pending-todo";
const FINISHED_TODO = "finished-todo";

const DELETED = "deleted";
const D_DAY = "d-day";

const UPDATE_CONTENT = "";
const UPDATE_DATE = "";

const pending = document.querySelector(`.${PENDING_TODO}`);
const finished = document.querySelector(`.${FINISHED_TODO}`);

const todoStorage = new TodoStorage();

export const paintPendingTodo = function (todo) {
  const li = repaintTodo(todo);
  pending.appendChild(li);
};

export const paintFinishedTodo = function (todo) {
  const li = getLiElement(todo);

  li.querySelectorAll("span").forEach(span => {
    span.classList.toggle(DELETED);
  });

  if (todo.date) {
    const dDaySpan = li.querySelector(`.${D_DAY}`);
    dDaySpan.innerText = todo.date;
  }

  const btnUndo = new TodoComponent('undo').getButtonComponent();
  li.insertBefore(btnUndo, li.firstChild);
  finished.appendChild(li);
};

const repaintTodo = function (todo) {
  const li = getLiElement(todo);

  const btnCancel = new TodoComponent('cancel').getButtonComponent();
  const btnFinish = new TodoComponent('finish').getButtonComponent();
  const btnUpdate = new TodoComponent('update').getButtonComponent();
  btnUpdate.addEventListener("click", paintUpdateTodo);

  li.insertBefore(btnFinish, li.firstChild);
  li.appendChild(btnUpdate);
  li.appendChild(btnCancel);

  return li;
}

const getLiElement = function (todo) {
  let li = document.getElementById(todo.id);

  if (!li) {
    li = document.createElement("li");
    li.id = todo.id;
  } else {
    while (li.hasChildNodes()) {
      li.removeChild(li.lastChild);
    }
  }

  const span = document.createElement("span");
  span.innerText = todo.text;

  const dDaySpan = document.createElement("span");
  dDaySpan.classList.toggle(D_DAY);

  if (todo.date) {
    dDaySpan.setAttribute("data-value", todo.date);
    dDaySpan.innerText = `D-${DateUtil.getDDay(todo.date)}`;
  }

  li.appendChild(span);
  li.appendChild(dDaySpan);

  return li;
}

const paintUpdateTodo = function (event) {
  const li = event.target.parentNode;
  const id = li.id;

  const btnUpdate = new TodoComponent('update').getButtonComponent();
  btnUpdate.addEventListener("click", updateTodo);

  const input = document.createElement("input");
  input.id = id;
  input.placeholder = li.querySelector("span").innerText;
  input.className = "update-content";
  input.required = true;
  input.addEventListener("keydown", updateTodo);

  const dateInput = document.createElement("input");
  dateInput.id = id;
  dateInput.type = "date";
  dateInput.min = DateUtil.getDateStr();
  dateInput.className = "update-date";
  dateInput.value = li.querySelector("span.d-day").getAttribute("data-value");
  dateInput.addEventListener("keydown", updateTodo);

  while (li.hasChildNodes()) {
    li.removeChild(li.lastChild);
  }

  li.appendChild(btnUpdate);
  li.appendChild(input);
  li.appendChild(dateInput);

  input.focus();
};

const updateTodo = function (event) {
  const li = event.target.parentNode;
  const id = li.id;

  const content = li.querySelector(".update-content").value;
  const date = li.querySelector(".update-date").value;

  if(event.type === "keydown" && event.key === "Escape") {
    const todoList = todoStorage.getTodos();
    const currentTodo = todoList.pendingList.find((x) => x.id === id);

    repaintTodo(currentTodo);
    return;
  }

  let div = li.querySelector("div.warning");
  
  if(div) {
    li.removeChild(li.firstChild);
  }

  if((!content && event.type === "click") || (!content && event.key === "Enter")) {
    div = document.createElement("div");
    div.innerText = "이 입력란을 작성하세요.";
    div.className = "warning";
    li.insertBefore(div, li.firstChild);
    return;
  }

  if (event.type === "click" || (event.type === "keydown" && event.code === "Enter")) {
    const todoList = todoStorage.getTodos();
    const idx = todoList.pendingList.findIndex((x) => x.id === id);
    const updatedTodo = todoList.pendingList[idx];

    updatedTodo.text = content;
    updatedTodo.date = date;

    todoList.pendingList[idx] = updatedTodo;
    todoStorage.setTodos(todoList);

    repaintTodo(updatedTodo);
  }
}