/* =========================================================
   Muhammad Usama - Portfolio
   Plain JavaScript, no libraries.
   ========================================================= */

// ---------- SETTINGS: CHANGE THIS ----------
// 1. Go to https://formspree.io and create a free form.
// 2. Copy the form ID (the last part of the form URL, for example "xyzabcde").
// 3. Paste it between the quotes below.
var FORMSPREE_ID = "YOUR_FORM_ID";


// ---------- THEME TOGGLE (dark / light) ----------
var themeBtn = document.getElementById("themeBtn");

function currentTheme() {
  if (document.documentElement.getAttribute("data-theme") === "light") {
    return "light";
  }
  return "dark";
}

function updateThemeButton() {
  if (currentTheme() === "light") {
    themeBtn.innerHTML = "&#9790;"; // moon
    themeBtn.setAttribute("aria-label", "Switch to dark theme");
  } else {
    themeBtn.innerHTML = "&#9728;"; // sun
    themeBtn.setAttribute("aria-label", "Switch to light theme");
  }
}

themeBtn.addEventListener("click", function () {
  var next = currentTheme() === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {}
  updateThemeButton();
});

updateThemeButton();


// ---------- MOBILE MENU ----------
var menuBtn = document.getElementById("menuBtn");
var navLinks = document.getElementById("navLinks");

function closeMenu() {
  navLinks.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}

menuBtn.addEventListener("click", function () {
  var isOpen = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

// close the menu after tapping a link
var menuLinks = navLinks.querySelectorAll("a");
for (var i = 0; i < menuLinks.length; i++) {
  menuLinks[i].addEventListener("click", closeMenu);
}


// ---------- PROFILE PHOTO FALLBACK ----------
// If photo.jpg is missing, the initials "MU" stay visible.
var photoBox = document.getElementById("photo");
var photoImg = document.getElementById("photoImg");

photoImg.addEventListener("error", function () {
  photoBox.classList.add("no-image");
});


// ---------- PROJECTS SLIDER ----------
var track = document.getElementById("sliderTrack");
var slides = track.children;
var prevBtn = document.getElementById("prevBtn");
var nextBtn = document.getElementById("nextBtn");
var countText = document.getElementById("sliderCount");
var slideIndex = 0;

function showSlide(index) {
  // wrap around at both ends
  if (index < 0) {
    index = slides.length - 1;
  }
  if (index >= slides.length) {
    index = 0;
  }
  slideIndex = index;
  track.style.transform = "translateX(-" + slideIndex * 100 + "%)";
  countText.textContent = slideIndex + 1 + " / " + slides.length;
}

prevBtn.addEventListener("click", function () {
  showSlide(slideIndex - 1);
});

nextBtn.addEventListener("click", function () {
  showSlide(slideIndex + 1);
});

// swipe on phones
var touchStartX = 0;

track.addEventListener("touchstart", function (event) {
  touchStartX = event.touches[0].clientX;
});

track.addEventListener("touchend", function (event) {
  var distance = event.changedTouches[0].clientX - touchStartX;
  if (distance < -50) {
    showSlide(slideIndex + 1);
  }
  if (distance > 50) {
    showSlide(slideIndex - 1);
  }
});

showSlide(0);


// ---------- ANIMATED NUMBER COUNTERS ----------
var counters = document.querySelectorAll("[data-count]");

function animateCounter(element) {
  var target = Number(element.getAttribute("data-count"));
  var duration = 1200; // milliseconds
  var startTime = null;

  function step(time) {
    if (startTime === null) {
      startTime = time;
    }
    var progress = Math.min((time - startTime) / duration, 1);
    element.textContent = Math.round(progress * target);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
  var counterObserver = new IntersectionObserver(function (entries) {
    for (var j = 0; j < entries.length; j++) {
      if (entries[j].isIntersecting) {
        animateCounter(entries[j].target);
        counterObserver.unobserve(entries[j].target);
      }
    }
  }, { threshold: 0.6 });

  for (var k = 0; k < counters.length; k++) {
    counters[k].textContent = "0";
    counterObserver.observe(counters[k]);
  }
}
// If the browser does not support this (or reduced motion is on),
// the numbers simply stay at their final values from the HTML.


// ---------- CONTACT FORM (Formspree) ----------
var form = document.getElementById("contactForm");
var formNote = document.getElementById("formNote");
var sendBtn = document.getElementById("sendBtn");

function showNote(message, type) {
  formNote.textContent = message;
  formNote.className = "form-note " + type;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  var name = document.getElementById("fName").value.trim();
  var email = document.getElementById("fEmail").value.trim();
  var message = document.getElementById("fMessage").value.trim();

  if (name === "" || email === "" || message === "") {
    showNote("Please fill in your name, email and message.", "error");
    return;
  }

  if (email.indexOf("@") === -1) {
    showNote("Please enter a valid email address.", "error");
    return;
  }

  if (FORMSPREE_ID === "YOUR_FORM_ID") {
    showNote("The form is not connected yet. Add your Formspree ID in script.js.", "error");
    return;
  }

  sendBtn.disabled = true;
  showNote("Sending...", "");

  fetch("https://formspree.io/f/" + FORMSPREE_ID, {
    method: "POST",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ name: name, email: email, message: message })
  })
    .then(function (response) {
      if (response.ok) {
        showNote("Thank you! Your message was sent.", "ok");
        form.reset();
      } else {
        showNote("Something went wrong. Please try again or email me directly.", "error");
      }
      sendBtn.disabled = false;
    })
    .catch(function () {
      showNote("No connection. Please check your internet and try again.", "error");
      sendBtn.disabled = false;
    });
});
