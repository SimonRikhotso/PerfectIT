let projects = [];

const modal = document.getElementById("previewModal");
const closeBtn = document.getElementById("closePreview");
const body = document.getElementById("previewBody");
const actions = document.getElementById("previewActions");


async function loadProjects() {
    try {
        const response = await fetch("../data/projects.json");
        projects = await response.json();

        renderProjects(projects);

    } catch (error) {
        console.error("Error loading projects:", error);
    }
}

loadProjects();

const grid = document.getElementById("projectsGrid");

function renderProjects(data) {

    grid.innerHTML = "";

    data.forEach(project => {

        const card = document.createElement("div");
        card.className = "project-card";

        card.innerHTML = `

            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
            </div>

            <h3>${project.title}</h3>

            <p class="student-name">
                ${project.student}
            </p>

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
            <a href="${project.github}" target="_blank" class="download-btn">
                View Code
            </a>
        `;
    }

    if (project.download) {
        actions.innerHTML += `
            <a href="${project.download}" target="_blank" class="download-btn">
                Download Project
            </a>
        `;
    }
}

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

