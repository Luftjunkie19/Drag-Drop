const allLists = document.querySelectorAll(".list");
const allTasks = document.querySelectorAll(".list-item");
const urgentList = document.querySelector(".list.urgent");
const essentialList = document.querySelector(".list.essential");
const importantList = document.querySelector(".list.important");
const selectUrgency = document.querySelector(".urgency");
const dateToBeDone = document.querySelector("#to-be-done");
const tasksNameInput = document.querySelector("#task-name");
const form = document.querySelector("form");
console.log(allLists);

let draggedItem = null;

let savedItems = [];

class LocalStorage {
  setLocalStorage() {
    localStorage.setItem("saved-tasks", JSON.stringify(savedItems));
  }

  getLocalStorage() {
    if (localStorage.getItem("saved-tasks") === null) {
      savedItems = [];
    } else {
      savedItems = JSON.parse(localStorage.getItem("saved-tasks"));

      console.log(savedItems);

      displayAppropriately();
    }
  }
}

function displayAppropriately() {
  savedItems.forEach((item) => {
    const element = document.createElement("div");
    element.classList.add("list-item");
    element.setAttribute("data-id", item.id);
    element.setAttribute("data-urgency", item.urgency);
    element.draggable = true;
    element.innerHTML = `<p>${item.taskName}</p> <small>${item.date}</small>`;
    element.addEventListener("dragstart", startDrag);
    element.addEventListener("dragend", endDrag);

    if (item.urgency === "important") {
      importantList.append(element);
    } else if (item.urgency === "essential") {
      essentialList.append(element);
    } else if (item.urgency === "urgent") {
      urgentList.append(element);
    }
  });
}

function startDrag(e) {
  console.log("dragging has been started", e.target);
  draggedItem = e.target;

  setTimeout(() => {
    draggedItem.style.display = "none";
  }, 0);
}

function endDrag(e) {
  console.log("dragging has been finished", e.target);
  setTimeout(() => {
    draggedItem.style.display = "block";
    draggedItem = null;
  }, 0);
}

allTasks.forEach((task) => {
  task.addEventListener("dragstart", startDrag);
  task.addEventListener("dragend", endDrag);
});

function dragOver(e) {
  e.preventDefault();
  this.style.opacity = 0.75;
}

function dragEnter(e) {
  e.preventDefault();
  this.style.opacity = 0.75;
}

function dragLeave(e) {
  e.preventDefault();
  this.style.opacity = 1;
}

function dropElement(e) {
  e.preventDefault();

  const idOfDragged = draggedItem.getAttribute("data-id");
  const element = savedItems.filter((doc) => doc.id === +idOfDragged)[0];
  const indexOfDragged = savedItems.indexOf(element);
  this.style.opacity = 1;

  if (!this.classList.contains(`${element.urgency}`)) {
    const updatedEl = new dailyTask(
      element.taskName,
      element.date,
      this.classList[1],
      element.id
    );
    console.log(updatedEl);

    savedItems.splice(indexOfDragged, 1, updatedEl);
    new LocalStorage().setLocalStorage();
  }

  this.append(draggedItem);
}

class dailyTask {
  constructor(taskName, date, urgency, id) {
    this.taskName = taskName;
    this.date = date;
    this.urgency = urgency;
    this.id = id;
  }

  addToAproppriate() {
    const item = document.createElement("div");
    item.draggable = true;
    item.classList.add("list-item");
    item.setAttribute("data-id", this.id);
    item.setAttribute("data-urgency", this.urgency);
    item.innerHTML = `<p>${this.taskName}</p> <small>${this.date}</small>`;

    if (selectUrgency.value === "essential") {
      essentialList.append(item);
    } else if (selectUrgency.value === "important") {
      importantList.append(item);
    } else if (selectUrgency.value === "urgent") {
      urgentList.append(item);
    }

    item.addEventListener("dragstart", startDrag);
    item.addEventListener("dragend", endDrag);
  }
}

function submitAdding(e) {
  e.preventDefault();

  if (tasksNameInput.value.trim() === "" || dateToBeDone.value === "") {
    return;
  }

  const newItem = new dailyTask(
    tasksNameInput.value,
    dateToBeDone.value,
    selectUrgency.value,
    new Date().getTime()
  );

  savedItems.push(newItem);
  const locaStorage = new LocalStorage();
  locaStorage.setLocalStorage();

  newItem.addToAproppriate();
  tasksNameInput.value = "";
  dateToBeDone.value = "";
}

allLists.forEach((list) => {
  list.addEventListener("dragover", dragOver);
  list.addEventListener("drop", dropElement);
  list.addEventListener("dragenter", dragEnter);
  list.addEventListener("dragleave", dragLeave);
});

form.addEventListener("submit", submitAdding);
window.addEventListener("DOMContentLoaded", () => {
  let localStorage = new LocalStorage();

  localStorage.getLocalStorage();
});
