const userId = localStorage.getItem("userId");

if (!userId) {
  window.location.href = "/index.html";
}

const todoList = document.getElementById("todoList");
const addBtn = document.getElementById("addBtn");
const shareSelect = document.getElementById("shareSelect");

addBtn.addEventListener("click", addTodo);

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

    item.innerHTML = `
      <div class="todo-left">
        <input type="checkbox">
        <span>${todo.title}</span>
      </div>

      <div class="todo-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
      </div>
    `;

    // SATIRA TIKLAYINCA SEÇ
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

document.getElementById("shareBtn").addEventListener("click", async () => {
  const email = document.getElementById("shareEmail").value;

  if (!selectedChecklistId) {
    alert("Select a checklist first");
    return;
  }

  if (!email) {
    alert("Enter email");
    return;
  }

  await fetch(`/api/checklists/${selectedChecklistId}/share`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "user-id": userId
    },
    body: JSON.stringify({ email })
  });

  alert("Shared successfully!");
});


function logout() {
  localStorage.removeItem("userId");
  window.location.href = "/index.html";
}

loadTodos();
