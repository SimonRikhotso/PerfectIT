function toggleMenu() {
    document
        .querySelector(".navbar")
        .classList.toggle("active");
}

const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.getElementById("nav-links");

mobileMenu.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

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


const topBtn =
document.getElementById("topBtn");

window.addEventListener("scroll", () => {

if(window.scrollY > 400){
    topBtn.style.display = "block";
}
else{
    topBtn.style.display = "none";
}

});

topBtn.addEventListener("click", () => {

window.scrollTo({
    top:0,
    behavior:"smooth"
});

});