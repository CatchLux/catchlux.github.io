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
  primaryNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded","false");
  }));
}

const sessions = [
["2026-10-05",false],["2026-10-12",false],["2026-10-19",false],["2026-10-26",false],
["2026-11-02",true],["2026-11-09",true],["2026-11-16",false],["2026-11-23",false],["2026-11-30",false],
["2026-12-07",false],["2026-12-14",false],["2026-12-21",true],["2026-12-28",true],
["2027-01-04",false],["2027-01-11",false],["2027-01-18",false],["2027-01-25",false],
["2027-02-01",false],["2027-02-08",true],["2027-02-15",false],["2027-02-22",false],
["2027-03-01",false],["2027-03-08",false],["2027-03-15",false],["2027-03-22",false],["2027-03-29",true],
["2027-04-05",true],["2027-04-12",false],["2027-04-19",false],["2027-04-26",false],
["2027-05-03",false],["2027-05-10",false],["2027-05-17",true],["2027-05-24",false],["2027-05-31",true],
["2027-06-07",false],["2027-06-14",false],["2027-06-21",false],["2027-06-28",false]
];

const mondaySelect=document.querySelector("#monday");
if(mondaySelect){
  sessions.forEach(([date,disabled])=>{
    const d=new Date(date+"T12:00:00");
    const label=new Intl.DateTimeFormat("en-GB",{weekday:"long",day:"numeric",month:"long"}).format(d);
    const option=document.createElement("option");
    option.value=date;
    option.disabled=disabled;
    option.textContent=disabled ? label+" — no session" : label;
    mondaySelect.appendChild(option);
  });
}

const REGISTRATION_ENDPOINT = "https://script.google.com/macros/s/AKfycbzC602tnl3QAYk1uN9fc9Ck7Kk6JcigcEmLdw6846U88mHPHLqLXFvr1M0w2sEUXAUvqA/exec";

const form=document.querySelector("#monday-form");
const formStatus=document.querySelector("#form-status");
if(form){
  form.addEventListener("submit", async e=>{
    e.preventDefault();
    if(!form.reportValidity()) return;

    const selectedOption=mondaySelect.options[mondaySelect.selectedIndex];
    if(!selectedOption || selectedOption.disabled || !selectedOption.value || !sessions.some(([date,disabled]) => date === selectedOption.value && !disabled)) return;

    const submitButton=form.querySelector('button[type="submit"]');
    const originalText=submitButton.textContent;
    submitButton.disabled=true;
    submitButton.textContent="Joining…";
    formStatus.classList.remove("active","error");
    formStatus.textContent="";

    const payload={
      monday:selectedOption.value,
      name:form.elements.name.value.trim(),
      email:form.elements.email.value.trim(),
      timestamp:new Date().toISOString()
    };

    try{
      if(!REGISTRATION_ENDPOINT){
        formStatus.classList.add("active");
        formStatus.textContent="✓ Preview registration received for "+selectedOption.textContent+". The Google Sheet is ready; the final connection only needs the Apps Script web-app URL.";
        return;
      }

      const response=await fetch(REGISTRATION_ENDPOINT,{
        method:"POST",
        mode:"cors",
        headers:{"Content-Type":"text/plain;charset=utf-8"},
        body:JSON.stringify(payload)
      });

      if(!response.ok) throw new Error("Registration failed");
      const result=await response.json();
      if(result.success !== true) throw new Error("Registration was not saved");
      form.reset();
      formStatus.classList.add("active");
      formStatus.textContent="✓ You’re in! We’ve received your registration for "+selectedOption.textContent+". See you at 19:30 at the Elsy Jacobs Gym!";
    }catch(error){
      formStatus.classList.add("active","error");
      formStatus.textContent="We couldn’t save your registration. Please try again or join us on WhatsApp.";
    }finally{
      submitButton.disabled=false;
      submitButton.textContent=originalText;
    }
  });
}

if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
}else{
  document.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible"));
}
