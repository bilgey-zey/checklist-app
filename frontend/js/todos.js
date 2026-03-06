const userId = localStorage.getItem("userId");

import { applyTodosPageTranslations, t, getLocale, setLocale } from "./i18n.js";

if (!userId) {
  window.location.href = "/index.html";
}

const todoList = document.getElementById("todoList");
const addBtn = document.getElementById("addBtn");
const logoutBtn = document.getElementById("logoutBtn");
const shareBtn = document.getElementById("shareBtn");
const liveRegion = document.getElementById("liveRegion");
const emptyState = document.getElementById("emptyState");
const tabMine = document.getElementById("tabMine");
const tabShared = document.getElementById("tabShared");
const addSection = document.querySelector(".add-section");
const langSelect = document.getElementById("langSelectTodos");

applyTodosPageTranslations();

addBtn.addEventListener("click", addTodo);

logoutBtn.addEventListener("click", logout);

let selectedChecklistId = null;
let currentView = "mine"; // "mine" | "shared"
let allTodos = [];

function refreshLanguageTodos() {
  applyTodosPageTranslations();
  if (langSelect) {
    langSelect.value = getLocale();
  }
}

if (langSelect) {
  langSelect.addEventListener("change", (e) => {
    setLocale(e.target.value);
    refreshLanguageTodos();
    renderTodos();
  });
}

refreshLanguageTodos();

function announce(text) {
  if (liveRegion) liveRegion.innerText = text;
}

function setView(view) {
  currentView = view;

  if (tabMine && tabShared) {
    tabMine.classList.toggle("tab--active", view === "mine");
    tabShared.classList.toggle("tab--active", view === "shared");
  }

  if (addSection) {
    addSection.style.display = view === "mine" ? "flex" : "none";
  }

  renderTodos();
}

if (tabMine && tabShared) {
  tabMine.addEventListener("click", () => setView("mine"));
  tabShared.addEventListener("click", () => setView("shared"));
}

function renderTodos() {
  if (!Array.isArray(allTodos)) return;

  const mine = allTodos.filter(todo => String(todo.owner_id) === String(userId));
  const shared = allTodos.filter(todo => String(todo.owner_id) !== String(userId));
  const list = currentView === "mine" ? mine : shared;

  todoList.innerHTML = "";

  const emptyTitle = document.getElementById("emptyTitle");
  const emptyText = document.getElementById("emptyText");

  if (!list.length) {
    emptyState.style.display = "block";
    if (currentView === "mine") {
      if (emptyTitle) emptyTitle.innerText = t("emptyMineTitle");
      if (emptyText) emptyText.innerText = t("emptyMineText");
    } else {
      if (emptyTitle) emptyTitle.innerText = t("emptySharedTitle");
      if (emptyText) emptyText.innerText = t("emptySharedText");
    }
  } else {
    emptyState.style.display = "none";
  }

  list.forEach(todo => {
    const item = document.createElement("div");
    item.className = "todo-item";
    item.setAttribute("role", "option");
    item.tabIndex = 0;
    item.setAttribute("aria-selected", "false");

    if (todo.completed) {
      item.classList.add("completed");
    }

    // LEFT SIDE
    const left = document.createElement("div");
    left.className = "todo-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `${todo.title}`);

    checkbox.addEventListener("click", async (e) => {
      e.stopPropagation();
      await toggleComplete(todo.id);
    });

    const title = document.createElement("span");
    title.innerText = todo.title;

    left.appendChild(checkbox);
    left.appendChild(title);

    // ACTIONS
    const actions = document.createElement("div");
    actions.className = "todo-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.type = "button";
    editBtn.innerText = t("edit");

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.type = "button";
    deleteBtn.innerText = t("delete");

    // DELETE
    deleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      await deleteTodo(todo.id);
    });

    // EDIT (sadece completed değilse aktif)
    if (!todo.completed) {
      editBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await editTodo(todo.id, todo.title);
      });
    } else {
      editBtn.disabled = true;
      editBtn.style.opacity = "0.5";
      editBtn.style.cursor = "not-allowed";
    }

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    item.appendChild(left);
    item.appendChild(actions);

    // SELECTION
    const select = () => {
      document.querySelectorAll(".todo-item").forEach(el => {
        el.classList.remove("selected");
        el.setAttribute("aria-selected", "false");
      });

      item.classList.add("selected");
      item.setAttribute("aria-selected", "true");
      selectedChecklistId = todo.id;
    };

    item.addEventListener("click", select);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        select();
      }
    });

    todoList.appendChild(item);
  });
}

async function loadTodos() {
  const response = await fetch("/api/checklists", {
    headers: {
      "user-id": userId,
      "Accept-Language": getLocale()
    }
  });

  allTodos = await response.json();
  renderTodos();
}

async function addTodo() {
  const title = document.getElementById("newTodo").value;
  if (!title) return;

  await fetch("/api/checklists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "user-id": userId,
      "Accept-Language": getLocale()
    },
    body: JSON.stringify({ title })
  });

  document.getElementById("newTodo").value = "";
  loadTodos();
}

async function deleteTodo(id) {
  await fetch(`/api/checklists/${id}`, {
    method: "DELETE",
    headers: {
      "user-id": userId,
      "Accept-Language": getLocale()
    }
  });

  loadTodos();
}

async function editTodo(id, oldTitle) {
  const newTitle = prompt(t("editPromptTitle"), oldTitle);
  if (!newTitle) return;

  await fetch(`/api/checklists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "user-id": userId,
      "Accept-Language": getLocale()
    },
    body: JSON.stringify({ title: newTitle })
  });

  loadTodos();
}

async function toggleComplete(id) {
  await fetch(`/api/checklists/${id}/complete`, {
    method: "PATCH",
    headers: {
      "user-id": userId,
      "Accept-Language": getLocale()
    }
  });

  loadTodos();
}

shareBtn.addEventListener("click", async () => {
  const raw = document.getElementById("shareEmail").value;
  const email = raw.trim().toLowerCase();

  if (!email) {
    alert(t("shareEmailRequired"));
    return;
  }

  try {
    const response = await fetch("/api/share-all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-id": userId,
        "Accept-Language": getLocale()
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    alert((data && data.message) ? data.message : t("serverError"));
    announce((data && data.message) ? data.message : t("serverError"));

  } catch (err) {
    console.error(err);
    announce(t("serverError"));
  }
});

function logout() {
  localStorage.removeItem("userId");
  window.location.href = "/index.html";
}

loadTodos();