const form=document.getElementById("problem-form");
const problemsList=document.getElementById("problems-list");

let problems=[];

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

    problems.push(problem);

    renderProblems();

    form.reset();
});

function renderProblems(){
    problemsList.innerHTML="";
    problems.forEach((problem, index) => {
    const div = document.createElement("div");
    div.className = "problem-card";
    div.innerHTML=`
    <strong>${problrm.name}</strong> <br>
    Topic: ${problem.topic} <br>
    Status: ${problem.status}
    `;

    problemsList.appendChild(div);
});
}
