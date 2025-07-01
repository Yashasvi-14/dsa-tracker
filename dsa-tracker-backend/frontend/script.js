
document.addEventListener("DOMContentLoaded",()=>{
const form=document.getElementById("form");
const problemsList=document.getElementById("problems-list");

const filterTopic=document.getElementById("filter-topic");
const filterStatus=document.getElementById("filter-status");

const searchInput=document.getElementById("search-box");

const sortSelect=document.getElementById("sort-by");

let problems= [];
fetchProblems();
function fetchProblems(){
fetch('/api/problems')
  .then(res => res.json())
  .then(data => {
    problems = data;
    renderProblems();
  })
  .catch(err => {
    console.error("Error fetching problems:", err);
    alert("Failed to load problems from server.");
  });
}

let editingIndex=-1;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("problem-name").value;
  const topic = document.getElementById("problem-topic").value;
  const status = document.getElementById("problem-status").value;
  const difficulty = document.getElementById("problem-difficulty").value;

  if (!name || !topic || !status || !difficulty) {
    alert("Please fill all fields.");
    return;
  }

  const problem = {
    title: name,
    topic,
    status,
    difficulty,
    tags: [],
    date: new Date()
  
  };
  
const editId = form.getAttribute("data-edit-id");

  // 🔁 UPDATE EXISTING PROBLEM
  if (editId) {
    fetch(`/api/problems/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(problem)
    })
    .then(res => res.json())
    .then(data => {
      const index = problems.findIndex(p => p._id === editId);
      if (index !== -1) problems[index] = data;

      form.removeAttribute("data-edit-id");
      editingIndex = -1;
      form.querySelector("button").textContent = "Add Problem";
      renderProblems();

      // Scroll to updated problem
      setTimeout(() => {
        const el = document.getElementById(`problem-${editId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 200);

      form.reset();
    })
    .catch(err => {
      console.error("Error updating problem:", err);
      alert("Failed to update problem.");
    });

    return;
  }

  // 🆕 CREATE NEW PROBLEM
  fetch('/api/problems', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(problem)
  })
    .then(res => res.json())
    .then(data => {
      problems.push(data);
      renderProblems();
      form.reset();
    })
    .catch(err => {
      console.error("Error adding problem:", err);
      alert("Failed to add problem. Try again.");
    });

  
});


function renderProblems() { 
  if (!problemsList) {
  alert("Missing problems-list div in HTML!");
  return;
}

  console.log("Rendering Problems:",problems);
    problemsList.innerHTML = "";

    const selectedTopic = filterTopic.value;
    const selectedStatus = filterStatus.value;
    const query = searchInput.value.toLowerCase();
    const sortValue=sortSelect.value;

    const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
    const statusOrder = { "Unsolved": 1, "Revise": 2, "Solved": 3 };

    let filtered = problems.filter(problem => {
        const matchTopic = selectedTopic ==="" || problem.topic === selectedTopic;
        const matchStatus = selectedStatus==="" || problem.status === selectedStatus;
        const matchSearch = query==="" || (problem.title || "").toLowerCase().includes(query);
        return matchTopic && matchStatus && matchSearch;
    });

  filtered.sort((a, b) => {
    switch (sortValue) {
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "difficulty-asc":
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case "difficulty-desc":
        return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
      case "status-asc":
        return statusOrder[a.status] - statusOrder[b.status];
      case "status-desc":
        return statusOrder[b.status] - statusOrder[a.status];
      default:
        return 0;
    }
  });

  if (filtered.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No problems found.";
        message.style.textAlign = "center";
        message.style.color = "#777";
        problemsList.appendChild(message);
        return;
    }

     filtered.forEach(problem => {
  const { _id, title, topic, status, difficulty } = problem;
  const card = document.createElement("div");
  card.id = `problem-${_id}`;

   card.className = "bg-white rounded-2xl shadow-lg p-4 border border-gray-200 transition transform hover:scale-[1.02] duration-200";

   card.innerHTML = `
  <div class="flex justify-between items-start mb-2">
    <h2 class="text-lg font-semibold text-gray-900">${problem.title}</h2>
    <span class="text-xs px-2 py-1 rounded-full font-semibold
      ${problem.status === "Solved" ? "bg-green-100 text-green-700" :
        problem.status === "Revise" ? "bg-yellow-100 text-yellow-700" :
        "bg-gray-200 text-gray-700"}">
      ${problem.status}
    </span>
  </div>
  <div class="flex justify-between items-center text-sm text-gray-600 mb-2">
    <span>📚 ${problem.topic}</span>
    <span class="px-2 py-1 text-xs rounded-full font-semibold
      ${problem.difficulty === "Easy" ? "bg-green-100 text-green-700" :
        problem.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" :
        "bg-red-100 text-red-700"}">
      ${problem.difficulty}
    </span>
  </div>
`;

  const actions = document.createElement("div");
actions.className = "flex flex-wrap gap-2 mt-3";

const baseBtnClass="px-3 py-1 text-sm font-semibold rounded shadow hover:scale-105 transition";

const solveBtn = document.createElement("button");
solveBtn.textContent = "✅Mark as Solved";
solveBtn.className = `${baseBtnClass} bg-green-500 text-white`;
solveBtn.onclick = () => markAsSolved(_id);

const reviseBtn = document.createElement("button");
reviseBtn.textContent = "🔁Mark to Revise";
reviseBtn.className =`${baseBtnClass} bg-yellow-400 text-black`;
reviseBtn.onclick = () => markForRevision(_id);

const editBtn = document.createElement("button");
editBtn.textContent = "✏️ Edit";
editBtn.className = `${baseBtnClass} bg-blue-500 text-white`;
editBtn.onclick = () => {
  document.getElementById("problem-name").value = title;
  document.getElementById("problem-topic").value = topic;
  document.getElementById("problem-status").value = status;
  document.getElementById("problem-difficulty").value = difficulty;
  editingIndex = problems.findIndex(p => p._id === _id);
  // Store _id temporarily on the form element for update
  form.setAttribute("data-edit-id", _id);

  form.querySelector("button").innerText = "Update Problem";

  // Scroll to top (optional)
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const deleteBtn = document.createElement("button");
deleteBtn.textContent = "❌ Delete";
deleteBtn.className = `${baseBtnClass} bg-red-500 text-white`;
deleteBtn.onclick = () => deleteProblem(_id);

actions.append(solveBtn, reviseBtn, editBtn, deleteBtn);
card.appendChild(actions);

const isToday = (new Date(problem.date)).toDateString() === new Date().toDateString();
if (isToday) {
  // inside title line
  card.querySelector('h2').innerHTML += ` <span class="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">🆕 Today</span>`;
}

        
    problemsList.appendChild(card);
  });
}

function deleteProblem(id) {
  fetch(`/api/problems/${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(data => {
      problems = problems.filter(problem => problem._id !== id);
      renderProblems();
    })
    .catch(err => {
      console.error("Failed to delete problem:", err);
      alert("Could not delete the problem.");
    });
}
window.markAsSolved=async function(id)
 {
    try {
        const res = await fetch(`/api/problems/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Solved' })
        });
        if (res.ok) {
            await fetchProblems(); // Refresh UI after update
        } else {
            console.error('Failed to update status');
        }
    } catch (error) {
        console.error('Error marking as solved:', error);
    }
}

window.markForRevision=async function(id) {
    try {
        const res = await fetch(`/api/problems/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Revise' })
        });
        if (res.ok) {
            await fetchProblems(); // Refresh UI after update
        } else {
            console.error('Failed to update status');
        }
    } catch (error) {
        console.error('Error marking for revision:', error);
    }
}



window.editProblem=function(index){
    const problem=problems[index];
    document.getElementById("problem-name").value=problem.title;
    document.getElementById("topic").value=problem.topic;
    document.getElementById("status").value=problem.status;
    document.getElementById("difficulty").value=problem.difficulty;
    editingIndex=index;
    form.querySelector("button").innerText="Update Problem";
};




searchInput.addEventListener("input", renderProblems);
filterTopic.addEventListener("change", renderProblems);
filterStatus.addEventListener("change", renderProblems);
sortSelect.addEventListener("change", renderProblems);


});


