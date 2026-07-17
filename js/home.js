let homepageStudents = [];
let currentIndex = 0;
let autoPlayTimer = null;
let isChangingSlide = false;

const track = document.getElementById("carouselTrack");
const carousel = document.querySelector(".student-carousel");
const previousButton = document.getElementById("prevStudent");
const nextButton = document.getElementById("nextStudent");

async function loadStudents(){
    if(!track) return;

    track.innerHTML = `<p class="carousel-message">Loading student stories...</p>`;

    try{
        const [studentResponse, reviewResponse] = await Promise.all([
            fetch("../data/students.json"),
            fetch("../data/reviews.json")
        ]);

        if(!studentResponse.ok || !reviewResponse.ok){
            throw new Error("Unable to load student stories");
        }

        const students = await studentResponse.json();
        const reviews = await reviewResponse.json();
        const studentsById = new Map(
            students.map(student => [student.studentId, student])
        );

        homepageStudents = reviews
            .filter(review => review.showOnHomepage)
            .map(review => ({
                ...studentsById.get(review.studentId),
                ...review
            }))
            .filter(student => student.studentId && student.name)
            .sort((first, second) =>
                (first.sortOrder ?? 999) - (second.sortOrder ?? 999)
            );

        if(homepageStudents.length === 0){
            track.innerHTML = `<p class="carousel-message">Student stories are coming soon.</p>`;
            return;
        }

        renderCarousel();
        startAutoPlay();
    }
    catch(error){
        console.error("Unable to load homepage reviews:", error);
        track.innerHTML = `
            <p class="carousel-message">
                Student stories could not be loaded right now.
            </p>`;
    }
}

function getStudentAt(offset){
    const index =
        (currentIndex + offset + homepageStudents.length)
        % homepageStudents.length;

    return homepageStudents[index];
}

function renderCarousel(direction = ""){
    if(homepageStudents.length === 0) return;

    const cards = homepageStudents.length === 1
        ? [createCard(getStudentAt(0), "current")]
        : [
            createCard(getStudentAt(-1), "previous"),
            createCard(getStudentAt(0), "current"),
            createCard(getStudentAt(1), "next")
        ];

    track.classList.remove("slide-left", "slide-right");
    track.innerHTML = cards.join("");

    if(direction){
        void track.offsetWidth;
        track.classList.add(direction);
    }

    previousButton.disabled = homepageStudents.length < 2;
    nextButton.disabled = homepageStudents.length < 2;
}

function createCard(student, position){
    const isCurrent = position === "current";

    return `
        <article
            class="student-card ${position}"
            ${isCurrent ? 'aria-current="true"' : 'aria-hidden="true"'}>

            <div class="student-avatar">
                ${createStudentAvatar(student)}
            </div>

            <h3>${student.name}</h3>
            <p class="institution">${student.institution}</p>

            <div class="stars" aria-label="${student.rating} out of 5 stars">
                ${createStars(student.rating)}
            </div>

            <div class="modules">${student.modules.join(" • ")}</div>
            <p class="testimonial">“${student.testimonial}”</p>

            ${isCurrent ? `
                <a class="btn-secondary" href="student-success.html">
                    Read More Student Stories
                </a>` : ""}
        </article>`;
}

function changeStudent(step, direction){
    if(isChangingSlide || homepageStudents.length < 2) return;

    isChangingSlide = true;
    currentIndex =
        (currentIndex + step + homepageStudents.length)
        % homepageStudents.length;

    renderCarousel(direction);

    window.setTimeout(() => {
        isChangingSlide = false;
    }, 450);
}

function nextStudent(){
    changeStudent(1, "slide-left");
}

function previousStudent(){
    changeStudent(-1, "slide-right");
}

function startAutoPlay(){
    stopAutoPlay();

    if(homepageStudents.length < 2) return;
    autoPlayTimer = window.setInterval(nextStudent, 6000);
}

function stopAutoPlay(){
    if(autoPlayTimer){
        window.clearInterval(autoPlayTimer);
        autoPlayTimer = null;
    }
}

previousButton?.addEventListener("click", () => {
    previousStudent();
    startAutoPlay();
});

nextButton?.addEventListener("click", () => {
    nextStudent();
    startAutoPlay();
});

carousel?.addEventListener("mouseenter", stopAutoPlay);
carousel?.addEventListener("mouseleave", startAutoPlay);
carousel?.addEventListener("focusin", stopAutoPlay);
carousel?.addEventListener("focusout", startAutoPlay);

let touchStartX = 0;

carousel?.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].clientX;
    stopAutoPlay();
}, { passive: true });

carousel?.addEventListener("touchend", event => {
    const distance = event.changedTouches[0].clientX - touchStartX;

    if(Math.abs(distance) > 50){
        distance < 0 ? nextStudent() : previousStudent();
    }

    startAutoPlay();
}, { passive: true });

document.addEventListener("visibilitychange", () => {
    document.hidden ? stopAutoPlay() : startAutoPlay();
});

loadStudents();
