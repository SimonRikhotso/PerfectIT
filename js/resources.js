let allResources = [];

const clearSearch = document.getElementById("clearSearch");
const resourceCount = document.getElementById("resourceCount");
const resourceGrid = document.getElementById("resourceGrid");
const featuredResources = document.getElementById("featuredResources");
const featuredResourceSection = document.getElementById("featuredResourceSection");
const resourceSearch = document.getElementById("resourceSearch");
const resourceFilters = document.getElementById("resourceFilters");
const resourceSummary = document.getElementById("resourceSummary");

async function loadResources() {

    try {

        const response = await fetch("../data/resources.json");

        if(!response.ok){
            throw new Error(`Unable to load resources (${response.status})`);
        }

        allResources = await response.json();

        createFilters();

        displayFeatured();

        displayResources(allResources);

        displayResourceSummary();

    }

    catch (error) {

        resourceGrid.innerHTML = `
            <p>Unable to load resources.</p>
        `;

        console.error(error);

    }

}

loadResources();

function displayResources(resources) {

    resourceGrid.innerHTML = "";

    resourceCount.textContent =
    `Showing ${resources.length} of ${allResources.length} resources`;

    if (resources.length === 0) {

        resourceGrid.innerHTML = `
            <div class="card">

                <h3>🔍 No matching resources found</h3>

                <p>

                    Try searching with different keywords
                    or choose another category.

                </p>

            </div>
            `;

        return;
    }

    resources.forEach(resource => {

        resourceGrid.innerHTML += createCard(resource);

    });

}

function createFilters() {

    const categories = [
        "All",
        ...new Set(allResources.map(resource => resource.category))
    ];

    resourceFilters.innerHTML = "";

    categories.forEach(category => {

        const button = document.createElement("button");

        button.className = "filter-btn";

        button.textContent = category;

        if (category === "All") {

            button.classList.add("active");

        }

        button.addEventListener("click", () => {

            document.querySelectorAll(".filter-btn").forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            if (category === "All") {

                filterResources();

            } else {

                filterResources();

            }

        });

        resourceFilters.appendChild(button);

    });

}

function filterResources() {

    const search = resourceSearch.value.trim().toLowerCase();

    const activeButton = document.querySelector(".filter-btn.active");

    const category = activeButton
        ? activeButton.textContent
        : "All";

    const filteringIsActive = search !== "" || category !== "All";

    if(featuredResourceSection){
        featuredResourceSection.hidden = filteringIsActive;
    }

    let filtered = allResources;

    if (category !== "All") {

        filtered = filtered.filter(resource =>
            resource.category === category
        );

    }

    filtered = filtered.filter(resource =>

        resource.title.toLowerCase().includes(search) ||

        resource.description.toLowerCase().includes(search) ||

        resource.category.toLowerCase().includes(search) ||

        resource.level.toLowerCase().includes(search) ||

        resource.type.toLowerCase().includes(search)

    );

    displayResources(filtered);

}

function displayFeatured() {

    const usage = getResourceUsage();

    const featured = [...allResources]
        .sort((first, second) => {
            const usageDifference =
                (usage[second.id] || 0) - (usage[first.id] || 0);

            if(usageDifference !== 0) return usageDifference;

            return Number(second.featured) - Number(first.featured);
        })
        .slice(0, 4);

    featuredResources.innerHTML = "";

    featured.forEach(resource => {

        featuredResources.innerHTML += createCard(resource);

    });

}

function getDefaultResourceImage(category) {

    const categoryIcons = {
        "Java": "../images/icons/Java-icon.png",
        "C#": "../images/icons/Csharp_icon.png",
        "C++": "../images/icons/Cpp-icon.png",
        "Python": "../images/icons/Python-icon.png",
        "Database": "../images/icons/database_icon.png",
        "Programming Logic": "../images/icons/PRLD-icon.png",
        "IPRG": "../images/icons/IPRG-icon.png",
        "Systems Analysis": "../images/icons/SAND-icon.png",
        "Developer Tools": "../images/PLogo.png"
    };

    return categoryIcons[category] || "../images/PLogo.png";

}

function getResourceImage(resource) {

    return resource.image || getDefaultResourceImage(resource.category);

}

function createResourceIcon(resource, className = "resource-module-icon") {

    const image = getResourceImage(resource);
    const fallback = getDefaultResourceImage(resource.category);

    return `
        <img
            src="${image}"
            class="${className}"
            alt="${resource.category} resource icon"
            loading="lazy"
            onerror="this.onerror=null;this.src='${fallback}'">
    `;

}

function displayResourceSummary() {

    if (!resourceSummary) return;

    const categoryCount = new Set(
        allResources.map(resource => resource.category)
    ).size;

    const sourceCount = new Set(
        allResources.map(resource => resource.source)
    ).size;

    resourceSummary.innerHTML = `
        <div class="resource-summary-item">
            <strong>${allResources.length}</strong>
            <span>Free resources</span>
        </div>

        <div class="resource-summary-item">
            <strong>${categoryCount}</strong>
            <span>Learning categories</span>
        </div>

        <div class="resource-summary-item">
            <strong>${sourceCount}</strong>
            <span>Trusted sources</span>
        </div>
    `;

}

function createCard(resource) {

    const isDownload = resource.action === "download";

    const actionButton = `
        <a
            href="${resource.url}"
            class="download-btn"
            onclick="trackResourceUse(${resource.id})"
            ${isDownload ? "download" : 'target="_blank" rel="noopener"'}>
            ${isDownload ? "📥" : "↗"} ${resource.buttonLabel}
        </a>`;

    return `

    <article class="resource-card">

        <div class="resource-icon">
            ${createResourceIcon(resource)}
        </div>

        <div class="resource-card-heading">
            <span class="resource-source-label">${resource.source}</span>
            ${resource.featured ? '<span class="resource-featured-label">Featured</span>' : ''}
        </div>

        <h3>${resource.title}</h3>

        <p>${resource.description}</p>

        <div class="resource-meta">

            <span>${resource.category}</span>

            <span>${resource.level}</span>

            <span>${resource.type}</span>

        </div>

        <button
            class="preview-btn"
            onclick="previewResource(${resource.id})">

            👁 View Details

        </button>

        ${actionButton}

    </article>

    `;

}

function getResourceUsage(){

    try{
        return JSON.parse(
            localStorage.getItem("perfectITResourceUsage") || "{}"
        );
    }
    catch(error){
        return {};
    }

}

function trackResourceUse(id){

    const usage = getResourceUsage();

    usage[id] = (usage[id] || 0) + 1;

    try{
        localStorage.setItem(
            "perfectITResourceUsage",
            JSON.stringify(usage)
        );
    }
    catch(error){
        console.warn("Resource popularity could not be saved.");
    }

    displayFeatured();

}

resourceSearch.addEventListener("input", () => {

    clearSearch.style.display =
        resourceSearch.value ? "block" : "none";

    filterResources();

});

clearSearch.addEventListener("click", () => {

    resourceSearch.value = "";

    clearSearch.style.display = "none";

    filterResources();

    resourceSearch.focus();

});

function previewResource(id) {

    const resource = allResources.find(r => r.id === id);
    if (!resource) return;

    const isDownload = resource.action === "download";

    const actionButton = `
        <a href="${resource.url}" class="download-btn"
           onclick="trackResourceUse(${resource.id})"
           ${isDownload ? "download" : 'target="_blank" rel="noopener"'}>
            ${isDownload ? "📥" : "↗"} ${resource.buttonLabel}
        </a>`;

    const previewImage = `
        <div class="preview-resource-icon">
            ${createResourceIcon(resource, "preview-resource-module-icon")}
        </div>
    `;

    // BODY CONTENT ONLY
    document.getElementById("previewBody").innerHTML = `
        ${previewImage}

        <h2>${resource.title}</h2>

        <p>${resource.description}</p>

        <p class="resource-source">Provided by ${resource.source}</p>

        <div class="resource-meta">
            <span>${resource.category}</span>
            <span>${resource.level}</span>
            <span>${resource.type}</span>
        </div>

        <h3>Topics Covered</h3>

        <div class="resource-meta">
            ${resource.topics.map(topic => `<span>${topic}</span>`).join("")}
        </div>
    `;

    // ACTION AREA (NO DUPLICATION)
    document.getElementById("previewActions").innerHTML = actionButton;

    document.getElementById("previewModal").style.display = "flex";
}

document
.getElementById("closePreview")
.addEventListener("click", () => {

    document
        .getElementById("previewModal")
        .style.display = "none";

});

window.addEventListener("click", event => {

    if (event.target.id === "previewModal") {

        document
        .getElementById("previewModal")
        .style.display = "none";

    }

});

document.addEventListener("keydown", event => {
    if(event.key === "Escape"){
        document.getElementById("previewModal").style.display = "none";
    }
});
