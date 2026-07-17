const perfectITStats = {

    founded: 2015,

    studentsMentored: 1000

};

let allReviews = [];

let allProjects = [];

let selectedModule = "All";

let searchText = "";


async function loadReviews() {

    try {

        const [reviewResponse, studentResponse, projectResponse] = await Promise.all([
            fetch("../data/reviews.json"),
            fetch("../data/students.json"),
            fetch("../data/projects.json")
        ]);

        const reviews = await reviewResponse.json();
        const students = await studentResponse.json();
        const projects = await projectResponse.json();
        allProjects = projects.filter(project => !project.isDemo);

        const studentsById = new Map(
            students.map(student => [student.studentId, student])
        );

        allReviews = reviews
            .map(review => ({
                ...studentsById.get(review.studentId),
                ...review
            }))
            .filter(student => student.studentId && student.name)
            .sort((a, b) => a.sortOrder - b.sortOrder);

        document.getElementById("reviewCount").textContent = allReviews.length;

        applyFilters();

        renderProjects();

        createModuleFilters();

    } catch (error) {

        console.error(error);

    }

}

loadReviews();

function renderReviews(reviews){

    const grid =
    document.getElementById("testimonialGrid");

    grid.innerHTML = "";

    reviews.forEach(student=>{

    createCard(student, grid);

});

}

function renderProjects(){

    const container =
        document.getElementById("projectsShowcase");

    if(!container) return;

    container.innerHTML = "";

    allProjects.forEach(project=>{

        const student =
            allReviews.find(review =>
                review.studentId === project.studentId
            );

        const projectLink = student?.allowPortfolio
            ? `student-projects.html?student=${encodeURIComponent(project.studentId)}`
            : "student-projects.html";

        const card =
            document.createElement("div");

        card.className = "project-showcase-card";

        card.innerHTML = `

            <img
                src="${project.image}"
                alt="${project.title}">

            <div class="project-showcase-info">

                <h3>${project.title}</h3>

                <p>

                    👨‍🎓 ${student ? student.name : "Former Student"}

                </p>

                <p>

                    ${project.module}

                </p>

                <a
    href="${projectLink}"
    class="cta">

    View Project →

</a>

            </div>

        `;

        container.appendChild(card);

    });

}

function getStudentProjects(studentId){

    return allProjects.filter(project =>
        project.studentId === studentId
    );

}

function createModuleFilters(){

    const container =
        document.getElementById("moduleFilters");

    container.innerHTML = "";

    const modules = new Set();

    allReviews.forEach(student=>{

        student.modules.forEach(module=>{

            modules.add(module);

        });

    });

    const list = ["All", ...Array.from(modules).sort()];

    list.forEach(module=>{

        const button =
            document.createElement("button");

        button.className = "filter-btn";

        if(module===selectedModule){

            button.classList.add("active");

        }

        button.textContent = module;

        button.addEventListener("click",()=>{

            selectedModule = module;

            applyFilters();

        });

        container.appendChild(button);

    });

}

function applyFilters(){

    const filtered = allReviews.filter(student=>{

        const matchesSearch =

            student.name.toLowerCase().includes(searchText)

            ||

            student.institution.toLowerCase().includes(searchText)

            ||

            student.modules.join(" ").toLowerCase().includes(searchText);

        const matchesModule =

            selectedModule==="All"

            ||

            student.modules.includes(selectedModule);

        return matchesSearch && matchesModule;

    });

    renderReviews(filtered);

    createModuleFilters();

}


function createProjectGallery(projects, student){

    if(projects.length === 0){
        return "";
    }

    let html = "";

    const projectLink = student.allowPortfolio
        ? `student-projects.html?student=${encodeURIComponent(student.studentId)}`
        : "student-projects.html";

    projects.forEach(project => {

        html += `

            <a
                href="${projectLink}"
                class="project-thumb"
                title="${project.title}">

                <img
                    src="${project.image}"
                    alt="${project.title}">

            </a>

        `;

    });

    return html;

}

function createCard(student, grid){

    const card = document.createElement("div");

    card.className = "testimonial-card";

    card.classList.add(
    moduleInfo[student.highestModule].class
);

    const stars = createStars(student.rating);

    const projects = getStudentProjects(student.studentId);

    const photo = createStudentPhoto(student);

    card.innerHTML = `

        <div class="testimonial-header">

    <div class="student">

        ${photo}

        <div class="student-info">

            <h3>${student.name}</h3>

            <p>

                ${student.institution}
                •
                ${student.firstYear} - ${student.lastYear}

            </p>

            <div class="rating">

                ${stars}

            </div>

            
        </div>

    </div>

</div>

        <div class="review collapsed">

            <span class="quote-icon">&ldquo;</span>

            <span class="review-text">
                "${student.testimonial}"
            </span>

        </div>

        <button class="read-more-btn">
            Read More
        </button>

        <div class="certification">

    <div class="cert-title">

        🛡️ PerfectIT Certified Developer

    </div>

    <p class="student-specialization">

    </p>

    <div class="skill-badges" id="badges-${student.id}">

    </div>


    <div class="student-project-section">

    <h4 class="project-gallery-title">
        🚀 Student Projects
    </h4>

    <div
        class="student-project-gallery"
        id="projects-${student.studentId}">
    </div>

</div>

    ${student.verified ? `

        <p class="recommend">

            ✔ Verified Former Student

        </p>

    ` : ""}

</div>

    `;

    grid.appendChild(card);

    const badgeContainer =
    card.querySelector(`#badges-${student.id}`);

badgeContainer.innerHTML =
    createModuleBadges(student);

    const projectGallery =
    card.querySelector(
        `#projects-${student.studentId}`
    );

projectGallery.innerHTML =
    createProjectGallery(projects, student);

    const projectSection =
    card.querySelector(".student-project-section");

if(projects.length === 0){

    projectSection.style.display = "none";

}
    
    const review =
    card.querySelector(".review");

const button =
    card.querySelector(".read-more-btn");

requestAnimationFrame(() => {

    if(review.scrollHeight <= 120){

        button.style.display = "none";

        review.classList.remove("collapsed");

        return;

    }

    button.addEventListener("click", () => {

        review.classList.toggle("collapsed");
        review.classList.toggle("expanded");

        button.textContent =
            review.classList.contains("expanded")
            ? "Read Less"
            : "Read More";

    });

});
}

document.addEventListener("DOMContentLoaded",()=>{

    const search =
        document.getElementById("testimonialSearch");

    search.addEventListener("input",()=>{

        searchText = search.value.toLowerCase();
        applyFilters();

    });

});
