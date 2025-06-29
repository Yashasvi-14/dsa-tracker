
document.addEventListener("DOMContentLoaded",()=>{
const form=document.getElementById("problem-form");
const problemsList=document.getElementById("problems-list");

const filterTopic=document.getElementById("filter-topic");
const filterStatus=document.getElementById("filter-status");

const searchInput=document.getElementById("searchInput");

const sortSelect=document.getElementById("sort-select");

let problems= [];
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

let editingIndex=-1;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("problem-name").value;
  const topic = document.getElementById("topic").value;
  const status = document.getElementById("status").value;
  const difficulty = document.getElementById("difficulty").value;

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

  // Currently skipping edit feature in backend (will add later)
  if (editingIndex !== -1) {
    // In future: Make a PUT request to backend
    problems[editingIndex] = problem;
    editingIndex = -1;
    form.querySelector("button").textContent = "Add Problem";
    renderProblems();
    form.reset();
    return;
  }

  // Send to backend
  fetch('/api/problems', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(problem)
  })
    .then(res => res.json())
    .then(data => {
      problems.push(data); // Push backend response
      renderProblems();
      form.reset();
    })
    .catch(err => {
      console.error("Error adding problem:", err);
      alert("Failed to add problem. Try again.");
    });
});


function renderProblems() {
    problemsList.innerHTML = "";

    const selectedTopic = filterTopic.value;
    const selectedStatus = filterStatus.value;
    const query = searchInput.value.toLowerCase();
    const sortValue=sortSelect.value;

    const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
    const statusOrder = { "Unsolved": 1, "Revise": 2, "Solved": 3 };

    let filtered = problems.filter(problem => {
        const matchTopic = !selectedTopic || problem.topic === selectedTopic;
        const matchStatus = !selectedStatus || problem.status === selectedStatus;
        const matchSearch = !query || (problem.title || "").toLowerCase().includes(query);
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
      const index=problems.findIndex(p=>p.__id===problem.__id);
        const div = document.createElement("div");
        div.className = "problem-card";
        div.innerHTML = `
            <strong>${problem.title}</strong> <br>
            Topic: ${problem.topic} <br>
            Status: <span class="status ${problem.status?.toLowerCase()}">${problem.status}</span> <br>
            Difficulty: <span class="difficulty ${problem.difficulty?.toLowerCase()}">${problem.difficulty}</span> <br>
        `;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "❌ Delete";
    deleteButton.className="delete-btn";
    deleteButton.addEventListener("click", () => deleteProblem(problem._id));

    const editButton = document.createElement("button");
    editButton.textContent = "✏️ Edit";
    editButton.addEventListener("click", () => {
      document.getElementById("problem-name").value = problem.title;
      document.getElementById("topic").value = problem.topic;
      document.getElementById("status").value = problem.status;
      document.getElementById("difficulty").value = problem.difficulty;
      editingIndex = problems.findIndex(p => p._id === problem._id);
      form.querySelector("button").innerText = "Update Problem";
    });
        div.appendChild(deleteButton);
    div.appendChild(editButton);

        
    problemsList.appendChild(div);
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


