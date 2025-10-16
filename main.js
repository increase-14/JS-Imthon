const form = document.getElementById('form');
const accordion = document.getElementById('accordion');
const drawer = document.getElementById('drawer');
const toggleForm = document.getElementById('toggleForm');

const API_URL = "https://faq-crud.onrender.com/api/faqs";

let data = [];
let editId = null;

window.addEventListener("DOMContentLoaded", loadPosts);

async function loadPosts() {
  try {
    const res = await fetch(API_URL);
    const result = await res.json();
    if (result.success) {
      data = result.data;
      renderAccordion();
    }
  } catch (err) {}
}

toggleForm.addEventListener('click', () => {
  drawer.classList.toggle('open');
  form.reset();
  editId = null;
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const question = document.getElementById('question').value.trim();
  const answer = document.getElementById('answer').value.trim();
  if (!question || !answer) return;

  try {
    if (editId) {
      await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer })
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer })
      });
    }
    form.reset();
    drawer.classList.remove('open');
    editId = null;
    loadPosts();
  } catch (err) {}
});

function renderAccordion() {
  accordion.innerHTML = '';
  data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'accordion-item';
    div.innerHTML = `
      <div class="header">${item.question}</div>
      <div class="content">
        <p>${item.answer}</p>
        <div class="actions">
          <button onclick="editItem('${item._id}')">O‘zgartirish</button>
          <button onclick="deleteItem('${item._id}')">O‘chirish</button>
        </div>
      </div>
    `;
    div.querySelector('.header').onclick = () => div.classList.toggle('active');
    accordion.appendChild(div);
  });
}

window.editItem = function(id) {
  const item = data.find(d => d._id === id);
  if (!item) return;
  drawer.classList.add('open');
  document.getElementById('question').value = item.question;
  document.getElementById('answer').value = item.answer;
  editId = id;
};

window.deleteItem = async function(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (result.success) loadPosts();
  } catch (err) {}
};
