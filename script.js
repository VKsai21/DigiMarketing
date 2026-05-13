// Scroll animation
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
});

// Icons
lucide.createIcons();


// Mobile Menu Toggle
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

const overlay = document.querySelector(".nav-overlay");

/* OPEN / CLOSE */
menuToggle.addEventListener("click", () => {

  navLinks.classList.toggle("active");
  overlay.classList.toggle("active");

});

/* CLOSE ON OUTSIDE CLICK */
overlay.addEventListener("click", () => {

  navLinks.classList.remove("active");
  overlay.classList.remove("active");

});

/* CLOSE AFTER CLICKING LINK */
document.querySelectorAll(".nav-links a").forEach(link => {

  link.addEventListener("click", () => {

    navLinks.classList.remove("active");
    overlay.classList.remove("active");

  });

});


const faqCards = document.querySelectorAll(".faq-card");

faqCards.forEach(card => {
  card.addEventListener("click", () => {

    // close others (premium behavior)
    faqCards.forEach(c => {
      if (c !== card) c.classList.remove("active");
    });

    card.classList.toggle("active");
  });
});

// const cards = document.querySelectorAll(".service-card");

// cards.forEach(card => {
//   card.addEventListener("click", () => {
//     if (window.innerWidth <= 768) {
//       card.classList.toggle("active");
//     }
//   });

//   card.addEventListener("mouseleave", () => {
//     if (window.innerWidth > 768) {
//       card.classList.remove("active");
//     }
//   });
// });

/* MOBILE */
// cards.forEach(card => {
//   card.addEventListener("click", () => {
//     if (window.innerWidth <= 768) {
//       card.classList.toggle("active");
//     }
//   });
// });

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw422Xfmg8jYTPq7AsOpCOBa70AaV7QxwJkyChsKXO894BH9-ERpbgsprbNOh0zaX-woA/exec";

const form = document.getElementById("leadForm");
const wrapper = document.querySelector(".form-wrapper");

/* =========================
   FORM SUBMIT (SAVE TO SHEET)
========================= */
form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append("type", "new");
  formData.append("name", form.name.value);
  formData.append("business", form.business.value);
  formData.append("phone", form.phone.value);
  formData.append("message", form.message.value);

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // 🔥 IMPORTANT
      body: formData
    });

    wrapper.classList.add("success");
    form.reset();

  } catch (err) {
    alert("Something went wrong");
  }
});

/* =========================
   ADMIN LOGIN
========================= */
const ADMIN_EMAIL = "admin@vmedia.com";
const ADMIN_PASS = "123456";

document.getElementById("adminTrigger").onclick = () => {
  document.getElementById("adminModal").style.display = "flex";
};

function login() {
  const email = document.getElementById("adminEmail").value;
  const pass = document.getElementById("adminPassword").value;

  if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
    document.getElementById("adminModal").style.display = "none";
    document.getElementById("adminPanel").style.display = "Flex";

    loadData();
  } else {
    alert("Invalid credentials");
  }
}

function closeAdmin() {
  document.getElementById("adminPanel").style.display = "none";
}

/* =========================
   LOAD DATA FROM SHEET
========================= */
async function loadData() {
  const res = await fetch(SCRIPT_URL);
  const data = await res.json();

  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  const rows = data.slice(1);

  // 🔥 SORT BY STATUS PRIORITY
  const priority = {
    "New": 1,
    "Contacted": 2,
    "Closed": 3
  };

  rows.sort((a, b) => {
    return (priority[a[5]] || 99) - (priority[b[5]] || 99);
  });

  rows.forEach((row, i) => {

    const actualRowIndex = data.indexOf(row); // 🔥 REAL ROW

    const card = document.createElement("div");
    card.className = "enquiry-card";

    card.innerHTML = `
      <h4>${row[0]}</h4>
      <p><strong>Business:</strong> ${row[1]}</p>
      <p><strong>Phone:</strong> ${row[2]}</p>
      <p>${row[3]}</p>
      <p><small>${row[4]}</small></p>

      <select id="status-${i}" class="status-select">
        <option ${row[5] === "New" ? "selected" : ""}>New</option>
        <option ${row[5] === "Contacted" ? "selected" : ""}>Contacted</option>
        <option ${row[5] === "Closed" ? "selected" : ""}>Closed</option>
      </select>

      <button onclick="updateStatus(${actualRowIndex}, document.getElementById('status-${i}').value)">
        Update
      </button>
    `;

    container.appendChild(card);
  });
}

/* =========================
   UPDATE STATUS
========================= */
async function updateStatus(rowIndex, status) {

  const formData = new FormData();
  formData.append("type", "update");
  formData.append("rowIndex", rowIndex);
  formData.append("status", status);

  await fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors", // 🔥 REQUIRED
    body: formData
  });

}

function openLeadModal() {
  document.getElementById("leadModal").style.display = "flex";
}

function closeLeadModal() {
  document.getElementById("leadModal").style.display = "none";

  // reset steps
  document.getElementById("leadStep").style.display = "block";
  document.getElementById("calendlyStep").style.display = "none";
  document.getElementById("calendlyEmbed").innerHTML = "";
}

function submitLead() {
  const name = document.getElementById("leadName").value;
  const phone = document.getElementById("leadPhone").value;
  const goal = document.getElementById("leadGoal").value;

  if (!name || !phone) {
    alert("Please fill required fields");
    return;
  }

  // save to sheet (your existing code)

  // 🔥 SWITCH STEP (SMOOTH)
  document.getElementById("leadStep").classList.remove("active");
  document.getElementById("calendlyStep").classList.add("active");

  // load calendly
  Calendly.initInlineWidget({
    url: "https://calendly.com/shoolinat/45min",
    parentElement: document.getElementById("calendlyEmbed"),
    prefill: { name }
  });
}

// const tcards = document.querySelectorAll(".team-card");
// const carousel = document.querySelector(".carousel");

// let index = 0;
// let startX = 0;
// let isDragging = false;

// /* UPDATE POSITIONS */
// function updateCarousel() {
//   tcards.forEach(card => {
//     card.classList.remove("active", "left", "right");
//   });

//   const total = tcards.length;

//   const active = index;
//   const left = (index - 1 + total) % total;
//   const right = (index + 1) % total;

//   tcards[active].classList.add("active");
//   tcards[left].classList.add("left");
//   tcards[right].classList.add("right");
// }

// /* AUTO SLIDE */
// let autoSlide = setInterval(nextSlide, 3500);

// function nextSlide() {
//   index = (index + 1) % tcards.length;
//   updateCarousel();
// }

// /* DRAG START */
// carousel.addEventListener("mousedown", (e) => {
//   isDragging = true;
//   startX = e.clientX;
//   clearInterval(autoSlide);
// });

// /* DRAG END */
// window.addEventListener("mouseup", (e) => {
//   if (!isDragging) return;

//   let diff = e.clientX - startX;

//   if (diff > 50) {
//     index = (index - 1 + tcards.length) % tcards.length;
//   } else if (diff < -50) {
//     index = (index + 1) % tcards.length;
//   }

//   updateCarousel();

//   autoSlide = setInterval(nextSlide, 3500);
//   isDragging = false;
// });

// /* TOUCH SUPPORT */
// carousel.addEventListener("touchstart", (e) => {
//   startX = e.touches[0].clientX;
// });

// carousel.addEventListener("touchend", (e) => {
//   let diff = e.changedTouches[0].clientX - startX;

//   if (diff > 50) {
//     index = (index - 1 + tcards.length) % tcards.length;
//   } else if (diff < -50) {
//     index = (index + 1) % tcards.length;
//   }

//   updateCarousel();
// });

// updateCarousel();

// cards.forEach(card => {
//   card.addEventListener("mousemove", (e) => {
//     if (!card.classList.contains("active")) return;

//     const rect = card.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     const centerX = rect.width / 2;
//     const centerY = rect.height / 2;

//     const rotateX = ((y - centerY) / centerY) * -6;
//     const rotateY = ((x - centerX) / centerX) * 6;

//     card.style.transform =
//       `translateX(-50%) scale(1) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
//   });

//   card.addEventListener("mouseleave", () => {
//     if (card.classList.contains("active")) {
//       card.style.transform = "translateX(-50%) scale(1)";
//     }
//   });
// });

// if (window.innerWidth > 768) {
//   cards.forEach(card => {
//     card.addEventListener("mousemove", (e) => {
//       if (!card.classList.contains("active")) return;

//       const rect = card.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;

//       const centerX = rect.width / 2;
//       const centerY = rect.height / 2;

//       const rotateX = ((y - centerY) / centerY) * -6;
//       const rotateY = ((x - centerX) / centerX) * 6;

//       card.style.transform =
//         `translateX(-50%) scale(1) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
//     });

//     card.addEventListener("mouseleave", () => {
//       if (card.classList.contains("active")) {
//         card.style.transform = "translateX(-50%) scale(1)";
//       }
//     });
//   });
// }

// let threshold = window.innerWidth <= 768 ? 30 : 50;

// carousel.addEventListener("touchend", (e) => {
//   let diff = e.changedTouches[0].clientX - startX;

//   if (diff > threshold) {
//     index = (index - 1 + cards.length) % cards.length;
//   } else if (diff < -threshold) {
//     index = (index + 1) % cards.length;
//   }

//   updateCarousel();
// });
const services = [
  {
    title: "Search Engine Optimization",
    desc: "We optimize your website to improve rankings, increase organic traffic, and build long-term visibility.",
    img: "seo.jpg"
  },
  {
    title: "Paid Campaigns",
    desc: "High-performing ad campaigns designed to drive targeted traffic and maximize ROI.",
    img: "paid.jpg"
  },
  {
    title: "Creative Design",
    desc: "Posters and videos that capture attention and communicate your brand effectively.",
    img: "poster.jpg"
  },
  {
    title: "Social Media Optimization",
    desc: "We enhance your brand presence with strategic content and audience engagement.",
    img: "SMO.jpg"
  },
  {
    title: "Website Handling",
    desc: "We maintain and optimize your website for performance and reliability.",
    img: "website.jpg"
  }
];

const circles = document.querySelectorAll(".circle");
const title = document.getElementById("service-title");
const desc = document.getElementById("service-desc");

let index = 0;

/* SET INITIAL IMAGES */
function applyImages() {
  circles.forEach(circle => {
    const i = circle.dataset.index;
    circle.style.backgroundImage = `url(${services[i].img})`;
  });
}

/* UPDATE TEXT */
function updateContent(i) {
  const content = document.querySelector(".rotator-content");

  content.classList.add("fade");

  setTimeout(() => {
    title.innerText = services[i].title;
    desc.innerText = services[i].desc;
    content.classList.remove("fade");
  }, 200);
}

/* ROTATION SYSTEM */
function rotate() {
  index = (index + 1) % services.length;

  circles.forEach(circle => {
    let i = parseInt(circle.dataset.index);
    i = (i + 1) % services.length;

    circle.dataset.index = i;
    circle.style.backgroundImage = `url(${services[i].img})`;
  });

  updateContent(index);
}

/* AUTO ROTATE */
setInterval(rotate, 4000);

/* CLICK */
circles.forEach(circle => {
  circle.addEventListener("click", () => {
    index = parseInt(circle.dataset.index);
    updateContent(index);
  });
});

/* INIT */
applyImages();
updateContent(0);