const todo = require("./todo");
const dateUtil = require("./dateUtil");

const pending = document.querySelector(".pending-todo");
const finished = document.querySelector(".finished-todo");

export const paintPendingTodo = function (todo) {
  const li = repaintTodo(todo);
  pending.appendChild(li);
};

export const paintFinishedTodo = function (todo) {
  const li = getLiElement(todo);

  li.querySelectorAll("span").forEach(span => {
    span.classList.toggle("deleted");
  });

  if (todo.date) {
    const dDaySpan = li.querySelector(".d-day");
    dDaySpan.innerText = todo.date;
  }

  const btnUndo = makeBtnUndo();
  btnUndo.addEventListener("click", undoTodo);
  li.insertBefore(btnUndo, li.firstChild);
  finished.appendChild(li);
};

const repaintTodo = function (todo) {
  const li = getLiElement(todo);

  const btnCancel = makeBtnCancel();
  btnCancel.addEventListener("click", cancelTodo);
  const btnFinish = makeBtnFinish();
  btnFinish.addEventListener("click", finishTodo);
  const btnUpdate = makeBtnUpdate();
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
  dDaySpan.classList.toggle("d-day");

  if (todo.date) {
    dDaySpan.setAttribute("data-value", todo.date);
    dDaySpan.innerText = `D-${dateUtil.getDDay(todo.date)}`;
  }

  li.appendChild(span);
  li.appendChild(dDaySpan);

  return li;
}

const makeBtnFinish = function () {
  const btnFinish = document.createElement("button");
  btnFinish.innerText = "✅";
  btnFinish.className = "finish";

  return btnFinish;
}

const makeBtnUpdate = function () {
  const btnUpdate = document.createElement("button");
  btnUpdate.innerText = "✏️";
  btnUpdate.className = "update";

  return btnUpdate;
}

const makeBtnCancel = function () {
  const btnCancel = document.createElement("button");
  btnCancel.innerText = "❌";
  btnCancel.className = "cancel";

  return btnCancel;
}

const makeBtnUndo = function () {
  const btnUndo = document.createElement("button");
  btnUndo.innerText = "⏪";
  btnUndo.className = "undo";

  return btnUndo;
}

const paintUpdateTodo = function (event) {
  const li = event.target.parentNode;
  const id = li.id;

  const btnUpdate = makeBtnUpdate();
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
  dateInput.min = dateUtil.getDateStr();
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

const deleteTodo = function (target) {
  target.parentNode.removeChild(target);
};

const updateTodo = function (event) {
  const li = event.target.parentNode;
  const id = li.id;

  const content = li.querySelector(".update-content").value;
  const date = li.querySelector(".update-date").value;

  if(event.type === "keydown" && event.key === "Escape") {
    const todoList = todo.getTodos();
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
    const todoList = todo.getTodos();
    const idx = todoList.pendingList.findIndex((x) => x.id === id);
    const updatedTodo = todoList.pendingList[idx];

    updatedTodo.text = content;
    updatedTodo.date = date;

    todoList.pendingList[idx] = updatedTodo;
    todo.setTodos(todoList);

    repaintTodo(updatedTodo);
  }
}

const cancelTodo = function (event) {
  const todoList = todo.getTodos();

  const id = event.target.parentNode.id;
  todoList.pendingList = todoList.pendingList.filter((x) => x.id !== id);

  todo.setTodos(todoList);
  deleteTodo(event.target.parentNode);
};

const finishTodo = function (event) {
  const todoList = todo.getTodos();

  const id = event.target.parentNode.id;
  const finishedTodo = todoList.pendingList.find((x) => x.id === id);
  todoList.pendingList = todoList.pendingList.filter((x) => x.id !== id);

  todoList.finishedList.push(finishedTodo);

  todo.setTodos(todoList);
  deleteTodo(event.target.parentNode);
  paintFinishedTodo(finishedTodo);
};

const undoTodo = function (event) {
  const todoList = todo.getTodos();

  const id = event.target.parentNode.id;
  const undoTodo = todoList.finishedList.find((x) => x.id === id);
  todoList.finishedList = todoList.finishedList.filter((x) => x.id !== id);

  todoList.pendingList.push(undoTodo);

  todo.setTodos(todoList);
  deleteTodo(event.target.parentNode);
  paintPendingTodo(undoTodo);
};