const perfectITStats = {

    founded: 2015,

    studentsMentored: 1000

};

let allReviews = [];

let selectedModule = "All";

let searchText = "";

const moduleInfo = {

    java: {
        class: "spec-java",
        ring: "spec-java-ring",
        badge: "badge-java",
        icon: "Java-icon.png",
        label: "Java"
    },

    csharp: {
        class: "spec-csharp",
        ring: "spec-csharp-ring",
        badge: "badge-csharp",
        icon: "Csharp_icon.png",
        label: "C Sharp"
    },

    database: {
        class: "spec-db",
        ring: "spec-db-ring",
        badge: "badge-db",
        icon: "database_icon.png",
        label: "Databases"
    },

    prld: {
        class: "spec-pld",
        ring: "spec-pld-ring",
        badge: "badge-pld",
        icon: "PRLD-icon.png",
        label: "PRLD"
    },

    iprg: {
        class: "spec-intro",
        ring: "spec-intro-ring",
        badge: "badge-intro",
        icon: "IPRG-icon.png",
        label: "IPRG"
    },

    cpp: {
        class: "spec-cpp",
        ring: "spec-cpp-ring",
        badge: "badge-cpp",
        icon: "Cpp-icon.png",
        label: "C++"
    },

    python: {
        class: "spec-python",
        ring: "spec-python-ring",
        badge: "badge-python",
        icon: "Python-icon.png",
        label: "Python"
    }

};

async function loadReviews() {

    try {

        const response = await fetch("../data/reviews.json");

        if (!response.ok) {
            throw new Error("Unable to load reviews.json");
        }

        const reviews = await response.json();

        reviews.sort((a, b) => a.sortOrder - b.sortOrder);

        allReviews = reviews;

        document.getElementById("reviewCount").textContent = reviews.length;

        applyFilters();

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

function createStars(rating){

    return "⭐".repeat(rating);

}


function createStudentPhoto(student){

    if(student.photo){

        return `
    <img
        src="../images/testimonials/${student.photo}"
        alt="${student.name}"
        class="${moduleInfo[student.highestModule].ring}">
`;

    }

    const names = student.name.split(" ");

    const initials =
        names[0][0] + names[names.length - 1][0];

    return `
        <div class="avatar ${moduleInfo[student.highestModule].ring}">
            ${initials}
        </div>
    `;

}

function createModuleBadges(student){

    let html = "";

    student.modules.forEach(module => {

        const key = module.toLowerCase()
                          .replace(" ", "")
                          .replace("+", "p");

        const info = moduleInfo[key];

        if(!info) return;

        html += `

            <div class="badge-container">

                <div class="skill-badge ${info.badge}">

                    <img src="../images/icons/${info.icon}"
                         alt="${info.label}">

                </div>

                <div class="badge-label">

                    ${info.label}

                </div>

            </div>

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