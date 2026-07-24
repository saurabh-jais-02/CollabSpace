// =================================
// COLLABSPACE JAVASCRIPT
// =================================

// CONTACT BUTTON
const contactButton = document.getElementById("contactButton");

if (contactButton) {
  contactButton.addEventListener("click", function () {
    alert("Thank you for contacting CollabSpace!");
  });
}

// =================================
// NAVBAR ACTIVE LINK
// =================================

const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.forEach(function (item) {
      item.classList.remove("active");
    });

    this.classList.add("active");
  });
});

// =================================
// NAVBAR SCROLL EFFECT
// =================================

window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");

  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});
