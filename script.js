document.addEventListener("DOMContentLoaded",()=>{
const form=document.getElementById("problem-form");
const problemsList=document.getElementById("problems-list");

const filterTopic=document.getElementById("filter-topic");
const filterStatus=document.getElementById("filter-status");

let problems= JSON.parse(localStorage.getItem("problems")) || [];
let editingIndex=-1;

renderProblems();

form.addEventListener("submit",function(e){
    e.preventDefault();

    const name=document.getElementById("problem-name").value;
    const topic=document.getElementById("topic").value;
    const status=document.getElementById("status").value;

    if(!name || !topic || !status)
    {
        alert("Please fill all fields.");
        return;
    }

    const problem={
        name,
        topic,
        status
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

function renderProblems(){
    problemsList.innerHTML="";
    const selectedTopic=filterTopic.value;
    const selectedStatus=filterStatus.value;
    const filtered=problems.filter(problem =>{
        const matchTopic=selectedTopic==="" || problem.topic ===selectedTopic;
        const matchStatus=selectedStatus===""|| problem.status===selectedStatus;
        return matchTopic && matchStatus;
    })
    filtered.forEach((problem,index) => {
    const div = document.createElement("div");
    div.className = "problem-card";
    div.innerHTML=`
    <strong>${problem.name}</strong> <br>
    Topic: ${problem.topic} <br>
    Status: ${problem.status} <br>
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
    editingIndex=index;
    form.querySelector("button").innerText="Update Problem";
};

filterTopic.addEventListener("change", renderProblems);
filterStatus.addEventListener("change", renderProblems);
});

