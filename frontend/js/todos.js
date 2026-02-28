const userId = localStorage.getItem("userId");


if (!userId) {
  window.location.href = "/index.html";
}

const todoList = document.getElementById("todoList");
const addBtn = document.getElementById("addBtn");
const logoutBtn = document.getElementById("logoutBtn");


addBtn.addEventListener("click", addTodo);

logoutBtn.addEventListener("click", logout);

let selectedChecklistId = null;

async function loadTodos() {
  const response = await fetch("/api/checklists", {
    headers: { "user-id": userId }
  });

  const data = await response.json();

  todoList.innerHTML = "";

  data.forEach(todo => {
    const item = document.createElement("div");
    item.className = "todo-item";

    if (todo.completed) {
      item.classList.add("completed");
    }

    // LEFT SIDE
    const left = document.createElement("div");
    left.className = "todo-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

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
    editBtn.innerText = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerText = "Delete";

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
    item.addEventListener("click", () => {
      document.querySelectorAll(".todo-item").forEach(el => {
        el.classList.remove("selected");
      });

      item.classList.add("selected");
      selectedChecklistId = todo.id;
    });

    todoList.appendChild(item);
  });
}

async function addTodo() {
  const title = document.getElementById("newTodo").value;
  if (!title) return;

  await fetch("/api/checklists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "user-id": userId
    },
    body: JSON.stringify({ title })
  });

  document.getElementById("newTodo").value = "";
  loadTodos();
}

async function deleteTodo(id) {
  await fetch(`/api/checklists/${id}`, {
    method: "DELETE",
    headers: { "user-id": userId }
  });

  loadTodos();
}

async function editTodo(id, oldTitle) {
  const newTitle = prompt("Edit checklist title:", oldTitle);
  if (!newTitle) return;

  await fetch(`/api/checklists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "user-id": userId
    },
    body: JSON.stringify({ title: newTitle })
  });

  loadTodos();
}

async function toggleComplete(id) {
  await fetch(`/api/checklists/${id}/complete`, {
    method: "PATCH",
    headers: { "user-id": userId }
  });

  loadTodos();
}

document.getElementById("shareBtn").addEventListener("click", async () => {
  const email = document.getElementById("shareEmail").value;

  if (!email) {
    alert("Enter email");
    return;
  }

  try {
    const response = await fetch("/api/share-all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-id": userId
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    alert(data.message);

  } catch (err) {
    console.error(err);
  }
});

function logout() {
  localStorage.removeItem("userId");
  window.location.href = "/index.html";
}

loadTodos();