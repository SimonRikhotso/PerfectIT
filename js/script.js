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