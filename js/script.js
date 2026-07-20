function toggleMenu() {
    document
        .querySelector(".navbar")
        .classList.toggle("active");
}

const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.getElementById("nav-links");


if(mobileMenu && navLinks){


mobileMenu.addEventListener("click", (e)=>{

    e.stopPropagation();

    navLinks.classList.toggle("active");
    mobileMenu.classList.toggle("open");

});



// close when clicking outside

document.addEventListener("click",(e)=>{


    if(
        !navLinks.contains(e.target) &&
        !mobileMenu.contains(e.target)
    ){

        navLinks.classList.remove("active");

    }


});



// close after selecting link

navLinks.querySelectorAll("a")
.forEach(link=>{


link.addEventListener("click",()=>{


    navLinks.classList.remove("active");


});


});


}

const cards =
document.querySelectorAll(".card");

const observer =
new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

cards.forEach(card => {
observer.observe(card);
});


const topBtn = document.getElementById("topBtn");

if (topBtn) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {
            topBtn.style.display = "block";
        } else {
            topBtn.style.display = "none";
        }

    });

    topBtn.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    const contactParams = new URLSearchParams(window.location.search);
    const selectedModule = contactParams.get("module");
    const opportunityStudent = contactParams.get("opportunity");
    const employerCandidate = contactParams.get("candidate");

    const moduleSelect = document.getElementById("module");

    if(selectedModule && moduleSelect){
        moduleSelect.value = selectedModule;
    }

    if(opportunityStudent){
        const message = document.getElementById("message");
        const subject = contactForm.querySelector('[name="_subject"]');

        if(moduleSelect){
            moduleSelect.value = "Developer Opportunity / Recruitment";
        }

        if(message){
            message.value = `I would like to enquire about a professional opportunity for ${opportunityStudent}. Please contact me to discuss the opportunity without sharing the student's private details.`;
        }

        if(subject){
            subject.value = `PerfectIT Developer Opportunity Enquiry: ${opportunityStudent}`;
        }
    }

    if(employerCandidate){
        const candidate = document.getElementById("candidate");
        const message = document.getElementById("message");
        if(candidate) candidate.value = employerCandidate;
        if(message) message.value = `I would like to discuss a professional opportunity for ${employerCandidate}.`;
    }

    const status = document.getElementById("formStatus");

    contactForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const button = contactForm.querySelector("button");

        button.disabled = true;
        button.textContent = "Sending...";

        status.textContent = "";
        status.className = "";

        const formData = new FormData(contactForm);

        try {

            const response = await fetch(
                "https://formspree.io/f/mpqvavwz",
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            if (response.ok) {

                status.textContent =
                    "✓ Thank you! Your enquiry has been sent successfully.";

                status.classList.add("success");

                contactForm.reset();

            } else {

                status.textContent =
                    "Unable to send your enquiry. Please try again.";

                status.classList.add("error");

            }

        } catch (error) {

            status.textContent =
                "Network error. Please try again later.";

            status.classList.add("error");

        }

        button.disabled = false;
        button.textContent = contactForm.closest(".employer-form-card") ? "Send Employer Enquiry" : "Send Enquiry";

    });

}
