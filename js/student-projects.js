let projects = [];
let students = [];
let reviews = [];

const studentPhoto = document.getElementById("studentPhoto");
const studentName = document.getElementById("studentName");
const studentQualification = document.getElementById("studentQualification");
const studentBio = document.getElementById("studentBio");


const studentVerification = document.getElementById("studentVerification");
const studentRating = document.getElementById("studentRating");
const studentInstitution = document.getElementById("studentInstitution");
const studentYears = document.getElementById("studentYears");
const studentModules = document.getElementById("studentModules");
const studentProfile = document.getElementById("studentProfile");
const projectsHeader = document.getElementById("projectsHeader");
const portfolioHeader = document.getElementById("portfolioHeader");
const portfolioTitle = document.getElementById("portfolioTitle");
const portfolioSubtitle = document.getElementById("portfolioSubtitle");


const githubLink = document.getElementById("githubLink");
const linkedinLink = document.getElementById("linkedinLink");
const portfolioLink = document.getElementById("portfolioLink");
const cvLink = document.getElementById("cvLink");

const urlParams = new URLSearchParams(window.location.search);

const selectedStudent = urlParams.get("student");

if (selectedStudent) {

    studentProfile.style.display = "block";

    portfolioHeader.style.display = "block";

    projectsHeader.style.display = "none";

} else {

    studentProfile.style.display = "none";

    portfolioHeader.style.display = "none";

    projectsHeader.style.display = "block";

}

const modal = document.getElementById("previewModal");
const closeBtn = document.getElementById("closePreview");
const body = document.getElementById("previewBody");
const actions = document.getElementById("previewActions");


function getStudent(studentId) {

    return students.find(
        student => student.studentId === studentId
    );

}

function getReview(studentId) {

    return reviews.find(review => review.studentId === studentId);

}

async function loadData() {

    const [projectsResponse, studentsResponse, reviewsResponse] = await Promise.all([
        fetch("../data/projects.json"),
        fetch("../data/students.json"),
        fetch("../data/reviews.json")
    ]);

    projects = await projectsResponse.json();
    students = await studentsResponse.json();
    reviews = await reviewsResponse.json();

    if (selectedStudent) {

    const student = getStudent(selectedStudent);

    if (student) {

        studentPhoto.src = student.photo || "../images/default-profile.png";
        studentPhoto.alt = student.displayName;

        studentName.textContent = student.displayName;
        studentQualification.textContent = student.qualification || "";
        studentBio.textContent = student.bio || "";

        const review = getReview(student.studentId);

        if(review)
        {

            studentVerification.textContent = review.verified ? "✔ Verified Former Student" : "";

            studentRating.textContent = "⭐".repeat(review.rating);

            studentInstitution.textContent = review.institution;

            studentYears.textContent = `${review.firstYear} - ${review.lastYear}`;

            //studentModules.innerHTML = createModuleBadges(review, false);
            studentModules.innerHTML = createPortfolioSkills(review, true);

        }

        portfolioTitle.textContent = `${student.displayName}'s Portfolio`;

        portfolioSubtitle.textContent = "A collection of programming projects completed during the student's learning journey with PerfectIT.";
        
        if (student.github) {
            githubLink.href = student.github;
            githubLink.style.display = "inline-block";
        }

        if (student.linkedin) {
            linkedinLink.href = student.linkedin;
            linkedinLink.style.display = "inline-block";
        }

        if (student.portfolio) {
            portfolioLink.href = student.portfolio;
            portfolioLink.style.display = "inline-block";
        }

        if (student.cv) {
            cvLink.href = student.cv;
            cvLink.style.display = "inline-block";
        }

    }

}

    if(selectedStudent){

    let filteredProjects =
    projects.filter(project =>
        project.studentId === selectedStudent
    );


filteredProjects.sort((a,b)=>{

    // Featured projects first
    if(a.featured && !b.featured){
        return -1;
    }

    if(!a.featured && b.featured){
        return 1;
    }


    // Higher difficulty later
    const difficultyOrder = {
        "Easy":1,
        "Medium":2,
        "Hard":3
    };


    return difficultyOrder[b.difficulty] -
           difficultyOrder[a.difficulty];

});

        portfolioSubtitle.textContent = `${filteredProjects.length} project${filteredProjects.length !== 1 ? "s" : ""} completed during this student's learning journey with PerfectIT.`;

    renderProjects(filteredProjects);

}else{

    renderProjects(projects);

}

}

loadData();

const grid = document.getElementById("projectsGrid");

function renderProjects(data) {

    grid.innerHTML = "";

    if (data.length === 0) {

    grid.innerHTML = `
        <div class="card">
            <h2>No projects available yet</h2>
            <p>
                This student hasn't published any portfolio projects yet.
            </p>
        </div>
    `;

    return;
}

    data.forEach(project => {

        const card = document.createElement("div");
        card.className = project.featured ? "project-card featured" : "project-card";

        const student = getStudent(project.studentId);

        console.log(project.studentId);
        console.log(student);

        const review = getReview(project.studentId);

          const studentName = review?.name || "Anonymous Student";

        const institution = review?.institution || "";

       const photo = student?.photo
        ? student.photo
        : "../images/default-profile.png";

        card.innerHTML = `

<div class="project-image">

<img 
src="${project.image}"
alt="${project.title}">

${project.featured ? 
`
<div class="featured-badge">
⭐ Featured Project
</div>
`
:""}

</div>


<div class="project-student">

<img 
src="${photo}"
alt="${studentName}">


<div class="student-details">

<h4>${studentName}</h4>

<small>${institution}</small>

</div>

</div>



<h3>${project.title}</h3>


<div class="project-meta">

<span>📚 ${project.module}</span>

<span>📈 ${project.level}</span>

<span>🛠 ${project.type}</span>

<span>⭐ ${project.difficulty}</span>

</div>



<p>
${project.description}
</p>



<div class="project-tech">

${project.technologies.map(tech=>
`
<span>
${tech}
</span>
`
).join("")}

</div>

<h4 class="skills-title">
    Key Skills
</h4>

<div class="project-skills">

${project.concepts.map(skill =>
    `<span>${skill}</span>`
).join("")}

</div>

<button class="preview-btn">
🚀 Explore Project
</button>

`;

        card.querySelector(".preview-btn").addEventListener("click", () => {
            openPreview(project);
        });

        grid.appendChild(card);

    });
}


function openPreview(project) {

    modal.style.display = "flex";

    body.innerHTML = `

<div class="portfolio-preview">


<div class="preview-feature">

${project.featured ? 
`
<div class="featured-badge">
⭐ Featured Project
</div>
`
:
""}

</div>


<img 
class="preview-image"
src="${project.image}"
alt="${project.title}">


<h2>${project.title}</h2>


<div class="preview-info">


<div>
<strong>Module</strong>
<p>${project.module}</p>
</div>


<div>
<strong>Level</strong>
<p>${project.level}</p>
</div>


<div>
<strong>Project Type</strong>
<p>${project.type}</p>
</div>


<div>
<strong>Difficulty</strong>
<p>${project.difficulty}</p>
</div>


</div>



<h3>
Project Overview
</h3>


<p>
${project.longDescription}
</p>



<h3>
Technology Stack
</h3>


<div class="preview-tags">

${project.technologies.map(item =>
`
<span>${item}</span>
`
).join("")}

</div>



<h3>
Skills Demonstrated
</h3>


<div class="preview-tags">

${project.concepts.map(item =>
`
<span>${item}</span>
`
).join("")}

</div>



${project.youtube ? `


<h3>
Project Demonstration
</h3>


<div class="project-video">

<iframe
src="${project.youtube}"
title="${project.title}"
allowfullscreen>

</iframe>

</div>


`
:
""}


</div>

`;

    actions.innerHTML = "";

    if (project.github) {

    actions.innerHTML += `
        <a href="${project.github}"
           target="_blank"
           class="download-btn">
            💻 View Code
        </a>
    `;

}

if (project.download) {

    actions.innerHTML += `
        <a href="${project.download}"
           target="_blank"
           class="download-btn">
            📥 Download Project
        </a>
    `;

}
}

closeBtn.addEventListener("click", closePreview);

window.addEventListener("click", (e) => {

    if (e.target === modal) {
        closePreview();
    }

});

function closePreview() {

    const iframe = body.querySelector("iframe");

    if (iframe) {
        iframe.src = "";
    }

    modal.style.display = "none";
}