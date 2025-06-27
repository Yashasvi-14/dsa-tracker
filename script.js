document.addEventListener("DOMContentLoaded",()=>{
const form=document.getElementById("problem-form");
const problemsList=document.getElementById("problems-list");

const filterTopic=document.getElementById("filter-topic");
const filterStatus=document.getElementById("filter-status");

const searchInput=document.getElementById("searchInput");

let problems= JSON.parse(localStorage.getItem("problems")) || [];
let editingIndex=-1;

renderProblems();

form.addEventListener("submit",function(e){
    e.preventDefault();

    const name=document.getElementById("problem-name").value;
    const topic=document.getElementById("topic").value;
    const status=document.getElementById("status").value;
    const difficulty=document.getElementById("difficulty").value;

    if(!name || !topic || !status || !difficulty)
    {
        alert("Please fill all fields.");
        return;
    }

    const problem={
        name,
        topic,
        status,
        difficulty
    };

    if(editingIndex!==-1)
    {
        problems[editingIndex]=problem;
        editingIndex=-1;
        form.querySelector("button").textContent="Add Problem";
    }
    else
    {
        problems.push(problem);
    }
    localStorage.setItem("problems", JSON.stringify(problems));

    renderProblems();

    form.reset();
});

function renderProblems(data = problems) {
    problemsList.innerHTML = "";

    const selectedTopic = filterTopic.value;
    const selectedStatus = filterStatus.value;

    const filtered = data.filter(problem => {
        const matchTopic = selectedTopic === "" || problem.topic === selectedTopic;
        const matchStatus = selectedStatus === "" || problem.status === selectedStatus;
        return matchTopic && matchStatus;
    });

    if (filtered.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No problems found.";
        message.style.textAlign = "center";
        message.style.color = "#777";
        problemsList.appendChild(message);
        return;
    }

    filtered.forEach((problem, index) => {
        const div = document.createElement("div");
        div.className = "problem-card";
        div.innerHTML = `
            <strong>${problem.name}</strong> <br>
            Topic: ${problem.topic} <br>
            Status: <span class="status ${problem.status.toLowerCase().replace(" ", "-")}">${problem.status}</span> <br>
            Difficulty: ${problem.difficulty} <br>
            <button onclick="deleteProblem(${index})">❌ Delete</button>
            <button onclick="editProblem(${index})">✏️ Edit</button>
        `;

        problemsList.appendChild(div);
    });
}
window.deleteProblem=function(index){
    problems.splice(index,1);
    localStorage.setItem("problems",JSON.stringify(problems));
    renderProblems();
};
window.editProblem=function(index){
    const problem=problems[index];
    document.getElementById("problem-name").value=problem.name;
    document.getElementById("topic").value=problem.topic;
    document.getElementById("status").value=problem.status;
    document.getElementById("difficulty").value=problem.difficulty;
    editingIndex=index;
    form.querySelector("button").innerText="Update Problem";
};

filterTopic.addEventListener("change", renderProblems);
filterStatus.addEventListener("change", renderProblems);

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const searched = problems.filter(problem =>
    problem.name.toLowerCase().includes(query)
  );
  renderProblems(searched);
});

});

