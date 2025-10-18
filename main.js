const API_URL = "https://faq-crud.onrender.com/api/faqs";

const form = document.getElementById("form");
const accordion = document.getElementById("accordion");
const drawer = document.getElementById("drawer");
const toggleForm = document.getElementById("toggleForm");

let list = [];
let editMode = null;

window.addEventListener("DOMContentLoaded", fetchFaqs);

async function fetchFaqs() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    list = json.data || json || [];
    renderFaqs();
  } catch (e) {
    console.log("Xato bor:", e);
  }
}

toggleForm.addEventListener("click", () => {
  drawer.classList.toggle("open");
  form.reset();
  editMode = null;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const q = document.getElementById("question").value.trim();
  const a = document.getElementById("answer").value.trim();

  if (!q || !a) return ;

  try {
    if (editMode) {
      await fetch(`${API_URL}/${editMode}`, { method: "DELETE" });
      editMode = null;
    }

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q, answer: a }),
    });

    if (!res.ok) throw new Error("Xato bor");

    form.reset();
    drawer.classList.remove("open");
    await fetchFaqs();
  } catch (e) {
    console.log("Xato bor:", e);
  }
});

function renderFaqs() {
  accordion.innerHTML = "";

  if (!list.length) {
    accordion.innerHTML = "<p style='text-align:center;'>Xato bor</p>";
    return;
  }

  list.forEach((item) => {
    const id = item._id || item.id;
    const box = document.createElement("div");
    box.className = "accordion-item";

    box.innerHTML = `
      <div class="header">${item.question}</div>
      <div class="content">
        <p>${item.answer}</p>
        <div class="buttons">
          <button class="edit" data-id="${id}">Ozgartirish</button>
          <button class="del" data-id="${id}">Ochirish</button>
        </div>
      </div>
    `;

    box.querySelector(".header").addEventListener("click", () => {
      box.classList.toggle("active");
    });

    box.querySelector(".edit").addEventListener("click", () => {
      const found = list.find((x) => (x._id || x.id) === id);
      if (!found) return;
      drawer.classList.add("open");
      document.getElementById("question").value = found.question;
      document.getElementById("answer").value = found.answer;
      editMode = found._id || found.id;
    });

    box.querySelector(".del").addEventListener("click", async () => {
      await removeFaq(id);
    });

    accordion.appendChild(box);
  });
}

async function removeFaq(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) await fetchFaqs();
    else console.log("Server javobi:", res.status);
  } catch (e) {
    console.log("Xato bor:", e);
  }
}
