let projects = [];
let students = [];
let reviews = [];

const studentPhoto = document.getElementById("studentPhoto");
const studentName = document.getElementById("studentName");
const studentQualification = document.getElementById("studentQualification");
const studentBio = document.getElementById("studentBio");

const githubLink = document.getElementById("githubLink");
const linkedinLink = document.getElementById("linkedinLink");
const portfolioLink = document.getElementById("portfolioLink");
const cvLink = document.getElementById("cvLink");

const urlParams = new URLSearchParams(window.location.search);

const selectedStudent =
    urlParams.get("student");

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

    const filteredProjects =
        projects.filter(project =>
            project.studentId === selectedStudent
        );

    renderProjects(filteredProjects);

}else{

    renderProjects(projects);

}

}

loadData();

const grid = document.getElementById("projectsGrid");

function renderProjects(data) {

    grid.innerHTML = "";

    data.forEach(project => {

        const card = document.createElement("div");
        card.className = "project-card";

        const student = getStudent(project.studentId);

        console.log(project.studentId);
        console.log(student);

        const review = getReview(project.studentId);

          const studentName = review?.name || "Anonymous Student";

        const institution = review?.institution || "";

       const photo = student?.photo
        ? student.photo
        : "../images/Plogo.png";

        card.innerHTML = `

            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
            </div>

            <div class="project-student">

                <img src="${photo}" alt="${studentName}">

                <div class="student-details">

                    <h4>${studentName}</h4>

                    <small>${institution}</small>

                </div>

            </div>

            <h3>${project.title}</h3>

            <div class="project-meta">

                <span>${project.module}</span>

                <span>${project.level}</span>

                <span>${project.type}</span>

            </div>

            <p>
                ${project.description}
            </p>

            <div class="project-tech">

                ${project.technologies.map(tech => 
                    `<span>${tech}</span>`
                ).join("")}

            </div>

            <button class="preview-btn">
                View Project
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

        <img class="preview-image" src="${project.image}" alt="${project.title}">

        <h2>${project.title}</h2>

        <p>${project.longDescription}</p>

        ${project.youtubeEmbed ? `

        <h4>Project Demonstration</h4>

        <div class="project-video">

        <iframe
            src="${project.youtubeEmbed}"
            title="${project.title}"
            frameborder="0"
            allow="
                accelerometer;
                autoplay;
                clipboard-write;
                encrypted-media;
                gyroscope;
                picture-in-picture;
                web-share"
            allowfullscreen>

        </iframe>

        </div>

    ` : ""}

        <div class="resource-meta">

            <span>${project.module}</span>
            <span>${project.level}</span>
            <span>${project.difficulty}</span>

        </div>

        <h4>Technologies</h4>
        <p>${project.technologies.join(" • ")}</p>

        <h4>Key Concepts</h4>
        <p>${project.concepts.join(" • ")}</p>

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