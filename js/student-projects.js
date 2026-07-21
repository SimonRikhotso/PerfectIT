let projects = [];
let students = [];
let reviews = [];

const studentPhoto = document.getElementById("studentPhoto");
const studentProfileInitials = document.getElementById("studentProfileInitials");
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
const developerDirectory = document.getElementById("developerDirectory");
const developerGrid = document.getElementById("developerGrid");
const opportunityPanel = document.getElementById("opportunityPanel");
const professionalTitle = document.getElementById("professionalTitle");
const opportunityDetails = document.getElementById("opportunityDetails");
const opportunityContact = document.getElementById("opportunityContact");
const demoProfileNotice = document.getElementById("demoProfileNotice");
const demoDirectoryNotice = document.getElementById("demoDirectoryNotice");
const portfolioSharePanel = document.getElementById("portfolioSharePanel");
const portfolioShareFooter = document.getElementById("portfolioShareFooter");
const copyPortfolioLink = document.getElementById("copyPortfolioLink");
const copyPortfolioLinkFooter = document.getElementById("copyPortfolioLinkFooter");
const whatsappShareLink = document.getElementById("whatsappShareLink");
const whatsappShareLinkFooter = document.getElementById("whatsappShareLinkFooter");
const linkedinShareLink = document.getElementById("linkedinShareLink");
const linkedinShareLinkFooter = document.getElementById("linkedinShareLinkFooter");
const printPortfolio = document.getElementById("printPortfolio");
const shareFeedback = document.getElementById("shareFeedback");
const grid = document.getElementById("projectsGrid");


const githubLink = document.getElementById("githubLink");
const linkedinLink = document.getElementById("linkedinLink");
const portfolioLink = document.getElementById("portfolioLink");
const cvLink = document.getElementById("cvLink");

const urlParams = new URLSearchParams(window.location.search);

const selectedStudent = urlParams.get("student");
const employerAudience = urlParams.get("audience") === "employer";

const employerPortfolioBanner = document.getElementById("employerPortfolioBanner");
const studentGuidanceCta = document.getElementById("studentGuidanceCta");

if(employerAudience){
    document.body.classList.add("employer-portfolio-mode");
    if(employerPortfolioBanner) employerPortfolioBanner.style.display = "flex";
    if(studentGuidanceCta) studentGuidanceCta.style.display = "none";
    const portfolioBackLink = document.querySelector(".portfolio-back-link");
    if(portfolioBackLink) portfolioBackLink.href = "student-projects.html?audience=employer";

    const employerLogoLink = document.querySelector(".logo .logo-link");
    if(employerLogoLink){
        employerLogoLink.removeAttribute("href");
        employerLogoLink.removeAttribute("target");
        employerLogoLink.setAttribute("aria-label", "PerfectIT Talent for Employers");
        employerLogoLink.classList.add("employer-logo-disabled");
        employerLogoLink.tabIndex = -1;
    }

    const employerNavLinks = document.getElementById("nav-links");
    if(employerNavLinks){
        employerNavLinks.innerHTML = `
            <a href="employers.html">Employer Home</a>
            <a href="student-projects.html?audience=employer" class="active">Browse Talent</a>
            <a href="employer-enquiry.html">Contact PerfectIT</a>
        `;

        employerNavLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => employerNavLinks.classList.remove("active"));
        });
    }
}

studentProfile.style.display = "none";
portfolioHeader.style.display = "none";
developerDirectory.style.display = selectedStudent ? "none" : "block";
projectsHeader.style.display = selectedStudent ? "none" : "block";

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

function hasPublicPortfolio(student) {
    return Boolean(student?.allowPortfolio);
}

function getPortfolioPhoto(student) {
    const mayShowPhoto = student?.portfolioVisibility?.showPhoto !== false;

    return mayShowPhoto && student?.photo
        ? `../images/students/${student.photo}`
        : "../images/default-profile.png";
}

function mayShowPortfolioPhoto(student) {
    return student?.portfolioVisibility?.showPhoto !== false && Boolean(student?.photo);
}

function getStudentRing(student) {
    return moduleInfo[student?.highestModule]?.ring || "";
}

function createPortfolioAvatar(student, className = "developer-initials") {
    if(mayShowPortfolioPhoto(student)){
        return `<img src="../images/students/${student.photo}" alt="${student.displayName}">`;
    }

    return `
        <div class="${className} ${getStudentRing(student)}"
             role="img"
             aria-label="${student.displayName} initials">
            ${getStudentInitials(student.name || student.displayName)}
        </div>
    `;
}

async function copyText(textToCopy) {
    if(navigator.clipboard && window.isSecureContext){
        await navigator.clipboard.writeText(textToCopy);
        return;
    }

    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = textToCopy;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    document.execCommand("copy");
    temporaryInput.remove();
}

function configurePortfolioSharing(student) {
    const portfolioUrl = window.location.href.split("#")[0];
    const demoLabel = student.isDemo ? " demonstration" : "";
    const shareMessage = `View ${student.displayName}'s${demoLabel} programming portfolio on PerfectIT. Explore the practical projects and technical skills presented here: ${portfolioUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`;

    portfolioSharePanel.style.display = "block";
    portfolioShareFooter.style.display = "flex";
    whatsappShareLink.href = whatsappUrl;
    whatsappShareLinkFooter.href = whatsappUrl;
    linkedinShareLink.href = linkedinUrl;
    linkedinShareLinkFooter.href = linkedinUrl;

    const handleCopy = async button => {
        const originalText = button.textContent;

        try{
            await copyText(portfolioUrl);
            button.textContent = "✓ Link Copied";
            shareFeedback.textContent = "Portfolio link copied to your clipboard.";
        }catch(error){
            shareFeedback.textContent = "Unable to copy automatically. Please copy the address from your browser.";
        }

        window.setTimeout(() => {
            button.textContent = originalText;
            shareFeedback.textContent = "";
        }, 2500);
    };

    copyPortfolioLink.onclick = () => handleCopy(copyPortfolioLink);
    copyPortfolioLinkFooter.onclick = () => handleCopy(copyPortfolioLinkFooter);
    printPortfolio.onclick = () => window.print();
}

function sortPortfolioProjects(studentProjects) {
    const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };

    return studentProjects.sort((first, second) => {
        if(first.featured && !second.featured) return -1;
        if(!first.featured && second.featured) return 1;

        return (difficultyOrder[second.difficulty] || 0)
            - (difficultyOrder[first.difficulty] || 0);
    });
}

function showPrivatePortfolioMessage() {
    projectsHeader.style.display = "block";
    projectsHeader.innerHTML = `
        <h1>Portfolio Not Public</h1>
        <p>
            This student has not approved a public portfolio, or the portfolio
            is not currently available. PerfectIT does not publish student
            information without permission.
        </p>
        <a class="cta" href="student-projects.html">View Public Projects</a>
    `;
    grid.innerHTML = "";
}

function renderOpportunityProfile(student) {
    opportunityPanel.style.display = student.openToOpportunities ? "block" : "none";

    if(!student.openToOpportunities) return;

    professionalTitle.textContent = student.professionalTitle || "Emerging Developer";

    const details = [];

    if(student.preferredRoles?.length){
        details.push(`<div><strong>Interested in</strong><span>${student.preferredRoles.join(" • ")}</span></div>`);
    }

    if(student.workPreferences?.length){
        details.push(`<div><strong>Work preference</strong><span>${student.workPreferences.join(" • ")}</span></div>`);
    }

    if(student.publicLocation){
        details.push(`<div><strong>Location</strong><span>${student.publicLocation}</span></div>`);
    }

    opportunityDetails.innerHTML = details.join("");

    if(student.isDemo){
        opportunityContact.style.display = "none";
    }else{
        opportunityContact.style.display = "inline-flex";
        opportunityContact.href = `employer-enquiry.html?candidate=${encodeURIComponent(student.displayName)}`;
    }
}

function renderPortfolio(student) {
    document.body.classList.add("portfolio-view");
    studentProfile.style.display = "block";
    portfolioHeader.style.display = "block";

    if(mayShowPortfolioPhoto(student)){
        studentPhoto.src = getPortfolioPhoto(student);
        studentPhoto.alt = student.displayName || "Student portfolio photo";
        studentPhoto.style.display = "block";
        studentProfileInitials.style.display = "none";
    }else{
        studentPhoto.style.display = "none";
        studentProfileInitials.style.display = "grid";
        studentProfileInitials.className = `student-profile-initials ${getStudentRing(student)}`;
        studentProfileInitials.textContent = getStudentInitials(student.name || student.displayName);
        studentProfileInitials.setAttribute("aria-label", `${student.displayName} initials`);
    }
    studentName.textContent = student.displayName;
    studentQualification.textContent = student.qualification || "Emerging Developer";
    studentBio.textContent = student.bio || "";
    demoProfileNotice.style.display = student.isDemo ? "block" : "none";

    const review = getReview(student.studentId);

    studentVerification.textContent = review?.verified ? "✔ Verified Former Student" : "";
    studentRating.textContent = review?.rating ? "⭐".repeat(review.rating) : "";
    studentInstitution.textContent = student.portfolioVisibility?.showInstitution
        ? student.institution || ""
        : "";
    studentYears.textContent = student.portfolioVisibility?.showStudyYears
        && student.firstYear && student.lastYear
        ? `${student.firstYear} - ${student.lastYear}`
        : "";
    studentModules.innerHTML = createPortfolioSkills(student);

    portfolioTitle.textContent = `${student.displayName}'s Portfolio`;

    [githubLink, linkedinLink, portfolioLink, cvLink].forEach(link => {
        link.style.display = "none";
        link.rel = "noopener noreferrer";
    });

    const publicLinks = [
        [githubLink, student.github],
        [linkedinLink, student.linkedin],
        [portfolioLink, student.portfolioWebsite || student.portfolio],
        [cvLink, student.cv]
    ];

    publicLinks.forEach(([element, url]) => {
        if(url){
            element.href = url;
            element.style.display = "inline-block";
        }
    });

    renderOpportunityProfile(student);
    configurePortfolioSharing(student);
}

function renderDeveloperDirectory() {
    const publicStudents = students.filter(hasPublicPortfolio);
    demoDirectoryNotice.style.display = publicStudents.some(student => student.isDemo)
        ? "block"
        : "none";

    if(publicStudents.length === 0){
        developerGrid.innerHTML = `
            <div class="directory-empty-state">
                <h3>Student portfolios are being prepared</h3>
                <p>Profiles will appear here only after each student has approved publication.</p>
            </div>
        `;
        return;
    }

    developerGrid.innerHTML = publicStudents.map(student => {
        const projectCount = projects.filter(
            project => project.studentId === student.studentId
        ).length;
        const status = student.openToOpportunities
            ? `<span class="developer-status available">Open to Opportunities</span>`
            : `<span class="developer-status">Portfolio Published</span>`;
        const demoStatus = student.isDemo
            ? `<span class="developer-status demo">Demonstration Profile</span>`
            : "";

        return `
            <article class="developer-card">
                ${createPortfolioAvatar(student)}
                <div class="developer-card-content">
                    ${demoStatus}
                    ${status}
                    <h3>${student.displayName}</h3>
                    <p>${student.professionalTitle || student.qualification || "Emerging Developer"}</p>
                    <div class="developer-skill-list">
                        ${student.modules.slice(0, 4).map(module => `<span>${module}</span>`).join("")}
                    </div>
                    <small>${projectCount} published project${projectCount === 1 ? "" : "s"}</small>
                    <a href="student-projects.html?student=${encodeURIComponent(student.studentId)}${employerAudience ? "&audience=employer" : ""}">
                        View Portfolio →
                    </a>
                </div>
            </article>
        `;
    }).join("");
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

    if(selectedStudent){
        const student = getStudent(selectedStudent);

        if(!hasPublicPortfolio(student)){
            showPrivatePortfolioMessage();
            return;
        }

        renderPortfolio(student);

        const filteredProjects = sortPortfolioProjects(
            projects.filter(project => project.studentId === selectedStudent)
        );

        portfolioSubtitle.textContent = `${filteredProjects.length} project${filteredProjects.length !== 1 ? "s" : ""} completed during this student's learning journey with PerfectIT.`;
        renderProjects(filteredProjects);
        return;
    }

    renderDeveloperDirectory();
    renderProjects(projects);

}

loadData();

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
        const publicStudent = hasPublicPortfolio(student) ? student : null;
        const studentName = publicStudent?.displayName || "PerfectIT Student";
        const institution = publicStudent?.portfolioVisibility?.showInstitution
            ? publicStudent.institution || ""
            : "";
        const studentAvatar = publicStudent
            ? createPortfolioAvatar(publicStudent, "project-student-initials")
            : `<div class="project-student-initials" role="img" aria-label="Anonymous PerfectIT student">PS</div>`;

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

${project.isDemo ? `
<div class="demo-project-badge">
Demo Project
</div>
` : ""}

</div>


<div class="project-student">

${studentAvatar}


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

${project.isDemo ? `
<div class="demo-preview-label">
Demonstration Project — fictional example
</div>
` : ""}

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



${(() => {
    const projectVideo = project.video?.enabled && project.video?.source
        ? { ...project.video, title: project.video.title || project.title }
        : project.youtube
            ? { type: "youtube", source: project.youtube, title: project.title }
            : null;

    return projectVideo ? `
        <h3>Project Demonstration</h3>
        <div class="project-video">
            ${createVideoPlayer(projectVideo)}
        </div>
    ` : "";
})()}


</div>

`;

    actions.innerHTML = "";

    if (project.website) {

    actions.innerHTML += `
        <a href="${project.website}"
           target="_blank"
           rel="noopener noreferrer"
           class="download-btn project-website-btn">
            🌐 Visit Live Website
        </a>
    `;

}

    if (project.github) {

    actions.innerHTML += `
        <a href="${project.github}"
           target="_blank"
           rel="noopener noreferrer"
           class="download-btn">
            💻 View Code
        </a>
    `;

}

if (project.download) {

    actions.innerHTML += `
        <a href="${project.download}"
           target="_blank"
           rel="noopener noreferrer"
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
