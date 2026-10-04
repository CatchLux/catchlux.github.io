document.querySelectorAll("a[href^='#']").forEach(link => {
  link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({behavior:"smooth"});
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

const mondaySelect = document.querySelector("#monday");

function formatMonday(date){
  return new Intl.DateTimeFormat("en-GB", {
    weekday:"long",
    day:"numeric",
    month:"long"
  }).format(date);
}

if(mondaySelect){
  const today = new Date();
  today.setHours(0,0,0,0);

  const seasonEnd = new Date("2027-06-30T00:00:00");
  const first = new Date(today);
  const daysUntilMonday = (8 - first.getDay()) % 7;
  first.setDate(first.getDate() + daysUntilMonday);

  let count = 0;
  const cursor = new Date(first);

  while(cursor <= seasonEnd && count < 10){
    const option = document.createElement("option");
    option.value = cursor.toISOString().slice(0,10);
    option.textContent = formatMonday(cursor);
    mondaySelect.appendChild(option);
    cursor.setDate(cursor.getDate() + 7);
    count++;
  }
}

const form = document.querySelector("#monday-form");
const formStatus = document.querySelector("#form-status");

if(form){
  form.addEventListener("submit", e => {
    e.preventDefault();

    if(!form.reportValidity()) return;

    formStatus.textContent = "Preview only — Google Sheets connection will be added before this goes live.";
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
  }, {threshold:.12});

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}else{
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
}