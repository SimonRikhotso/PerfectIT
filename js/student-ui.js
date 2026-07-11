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

function createModuleBadges(student, compact = true){

    let html = "";

    student.modules.forEach(module => {

        const key = module.toLowerCase()
                          .replace(" ", "")
                          .replace("+", "p");

        const info = moduleInfo[key];

        if(!info) return;

        const badgeClass = compact
    ? "badge-container"
    : "badge-container portfolio-badge";

html += `

    <div class="${badgeClass}">

        <div class="skill-badge ${info.badge}">

            <img
                src="../images/icons/${info.icon}"
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

function createPortfolioSkills(student){

    let html = "";

    student.modules.forEach(module => {

        const key = module
            .toLowerCase()
            .replace(" ", "")
            .replace("+", "p");

        const info = moduleInfo[key];

        if(!info) return;

        html += `

            <div class="portfolio-skill">

                <img
                    src="../images/icons/${info.icon}"
                    alt="${info.label}">

                <span>${info.label}</span>

            </div>

        `;

    });

    return html;

}