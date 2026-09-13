document.querySelectorAll("a[href^='#']").forEach(link => {

link.addEventListener("click", e => {

const target = document.querySelector(link.getAttribute("href"));
if(!target) return;

e.preventDefault();

target.scrollIntoView({

behavior:"smooth"

});

});

});

const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector("#primary-nav");

if(navToggle && primaryNav){

navToggle.addEventListener("click", () => {

const isOpen = primaryNav.classList.toggle("open");
navToggle.classList.toggle("open", isOpen);
navToggle.setAttribute("aria-expanded", isOpen);

});

primaryNav.querySelectorAll("a").forEach(link => {

link.addEventListener("click", () => {

primaryNav.classList.remove("open");
navToggle.classList.remove("open");
navToggle.setAttribute("aria-expanded", "false");

});

});

}

if("IntersectionObserver" in window){

const observer = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){
entry.target.classList.add("visible");
observer.unobserve(entry.target);
}

});

}, { threshold:0.15 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

}else{

document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));

}
