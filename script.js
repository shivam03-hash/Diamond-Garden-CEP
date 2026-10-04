const facilities = [
    {
        name: "Walking / Jogging Track", icon: "🚶", image: "assets/walking-path.jpg", category: "recreation",
        text: "Walking and jogging are publicly reported uses of Diamond Garden.",
        status: "Verify on visit",
        details: {
            basis: "Public descriptions identify a walking/jogging track or pathway at Diamond Garden.",
            observe: "Surface condition, width, cleanliness, crowd level, accessibility and any damaged or uneven portions.",
            survey: "Record approximate users during your chosen time slot and note whether different age groups use the track.",
            improvement: "Add recommendations only after observing an actual issue, such as damaged surface, crowding or accessibility difficulty."
        }
    },
    {
        name: "Open-Air Gym / Exercise", icon: "🏋️", image: "assets/open-air-gym.jpg", category: "recreation",
        text: "Public descriptions report outdoor exercise facilities and regular workout use.",
        status: "Verify on visit",
        details: {
            basis: "A published park-development study mentions an open gym; public descriptions also report exercise use.",
            observe: "Count visible equipment, check condition, safety, cleanliness and whether equipment is being used.",
            survey: "Record approximate users and the main age groups using the exercise area.",
            improvement: "Suggest repair, replacement, safety signage or additional equipment only if supported by observations."
        }
    },
    {
        name: "Yoga / Meditation Area", icon: "🧘", image: "assets/covered-yoga-area.jpg", category: "recreation",
        text: "Yoga, meditation and group exercise are reported uses of the garden.",
        status: "Verify on visit",
        details: {
            basis: "Public descriptions and a park-development study mention yoga/meditation-related use and a yoga lawn.",
            observe: "Look for a clearly identifiable yoga/exercise space and note how it is being used.",
            survey: "Record whether organized or informal yoga/meditation activity is visible during your visit.",
            improvement: "Recommend space, cleanliness or signage improvements only when an actual need is observed."
        }
    },
    {
        name: "Children's Play Area", icon: "🛝", image: "assets/20260927_122436PMByGPSMapCamera.jpg", category: "recreation",
        text: "The field visit photograph documents the children's play area and equipment.",
        status: "Field photo",
        details: {
            basis: "Field visit photograph of the children's play area.",
            observe: "Record visible play equipment, safety, cleanliness, flooring and accessibility.",
            survey: "Note whether children are using the area and whether any equipment appears damaged or unsafe.",
            improvement: "Recommend repairs, safety surfacing or additional equipment only if a real need is documented."
        }
    },
    {
        name: "Seating Areas", icon: "🪑", image: "assets/20260927_123621PMByGPSMapCamera.jpg", category: "comfort",
        text: "The field visit photograph documents seating and public-use space.",
        status: "Field photo",
        details: {
            basis: "Field visit photograph of the seating area.",
            observe: "Count usable benches/seats, note shade, condition, cleanliness and accessibility.",
            survey: "Record whether seating is sufficient during your visit and whether people are using it.",
            improvement: "Recommend repair or replacement where damaged seating is observed."
        }
    },
    {
        name: "Green & Open Spaces", icon: "🌳", image: "assets/green-space.jpg", category: "comfort",
        text: "The garden is documented as a public green/open space in Chembur.",
        status: "Verify on visit",
        details: {
            basis: "The garden is listed by MCGM as a municipal garden/open-space plot.",
            observe: "Condition of lawns, trees, plants, open areas, pathways and visible maintenance.",
            survey: "Record areas that are well maintained and any visibly dry, damaged or neglected portions.",
            improvement: "Recommend planting, maintenance or accessibility changes only when supported by field evidence."
        }
    },
    {
        name: "Lighting & Safety", icon: "💡", image: "assets/garden-walkway.jpg", category: "safety",
        text: "Current lighting performance should be checked during the field visit.",
        status: "Field survey",
        details: {
            basis: "Reliable current source information on individual light points was not established.",
            observe: "Check lighting points, visibility, entrances/exits, dark spots and safety signage.",
            survey: "If visiting in an evening slot, record working/non-working lights and any poorly lit areas.",
            improvement: "Suggest additional or repaired lighting only where a real visibility or safety issue is found."
        }
    },
    {
        name: "Drinking Water", icon: "💧", image: "assets/20260927_123716PMByGPSMapCamera.jpg", category: "comfort",
        text: "The field visit photograph documents a drinking-water point inside the garden.",
        status: "Field photo",
        details: {
            basis: "Field visit photograph showing the drinking-water point.",
            observe: "Check water point condition, cleanliness, tap operation, drainage and accessibility.",
            survey: "Record whether the drinking-water point is usable and whether visitors are using it.",
            improvement: "Recommend repair, cleaning, signage or better accessibility only if an actual need is observed."
        }
    }
];

const facilityGrid = document.getElementById("facilityGrid");
const facilityCount = document.getElementById("facilityCount");
facilityCount.textContent = facilities.length;

function renderFacilities(filter = "all") {
    const list = filter === "all" ? facilities : facilities.filter(item => item.category === filter);
    facilityGrid.innerHTML = list.map(item => `
        <article class="facility-card" tabindex="0" role="button" data-facility="${item.name}">
            <img class="facility-image" src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="facility-icon">${item.icon}</div>
            <h3>${item.name}</h3>
            <p>${item.text}</p>
            <span class="status">${item.status}</span>
            <span class="view-details">Open full details →</span>
        </article>
    `).join("");

    document.querySelectorAll(".facility-card").forEach(card => {
        card.addEventListener("click", () => openFacilityModal(card.dataset.facility));
        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openFacilityModal(card.dataset.facility);
            }
        });
    });
}

function createFacilityModal() {
    const modal = document.createElement("div");
    modal.className = "facility-modal";
    modal.id = "facilityModal";
    modal.innerHTML = `
        <div class="facility-modal-content" role="dialog" aria-modal="true" aria-labelledby="modalFacilityTitle">
            <button class="facility-modal-close" type="button" aria-label="Close">×</button>
            <div class="modal-facility-icon" id="modalFacilityIcon"></div>
            <span class="modal-kicker">FACILITY INFORMATION</span>
            <h3 id="modalFacilityTitle"></h3>
            <p id="modalFacilityIntro" class="modal-intro"></p>
            <div class="modal-detail-box"><strong>Research basis</strong><span id="modalBasis"></span></div>
            <div class="modal-detail-box"><strong>What to observe</strong><span id="modalObservation"></span></div>
            <div class="modal-detail-box"><strong>Field survey</strong><span id="modalSurvey"></span></div>
            <div class="modal-detail-box"><strong>Improvement requirement</strong><span id="modalImprovement"></span></div>
            <img class="modal-facility-photo" id="modalFacilityPhoto" src="" alt="">
            <div class="modal-note">No current survey result is being invented. Add your own observation after visiting Diamond Garden.</div>
        </div>`;
    document.body.appendChild(modal);
    modal.addEventListener("click", event => {
        if (event.target === modal || event.target.closest(".facility-modal-close")) closeFacilityModal();
    });
}

function openFacilityModal(name) {
    if (!document.getElementById("facilityModal")) createFacilityModal();
    const item = facilities.find(f => f.name === name);
    if (!item) return;
    const d = item.details;
    document.getElementById("modalFacilityIcon").textContent = item.icon;
    document.getElementById("modalFacilityTitle").textContent = item.name;
    document.getElementById("modalFacilityIntro").textContent = item.text;
    document.getElementById("modalBasis").textContent = d.basis;
    document.getElementById("modalObservation").textContent = d.observe;
    document.getElementById("modalSurvey").textContent = d.survey;
    document.getElementById("modalImprovement").textContent = d.improvement;
    const modalPhoto = document.getElementById("modalFacilityPhoto");
    if (modalPhoto) {
        modalPhoto.src = item.image;
        modalPhoto.alt = item.name;
    }
    document.getElementById("facilityModal").classList.add("show");
    document.body.classList.add("modal-open");
}

function closeFacilityModal() {
    const modal = document.getElementById("facilityModal");
    if (modal) modal.classList.remove("show");
    document.body.classList.remove("modal-open");
}

renderFacilities();

document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        renderFacilities(button.dataset.filter);
    });
});

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach(link => link.addEventListener("click", () => navLinks.classList.remove("open")));

document.addEventListener("keydown", event => { if (event.key === "Escape") closeFacilityModal(); });

const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".nav-links a");
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navItems.forEach(item => item.classList.remove("active"));
            const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (active) active.classList.add("active");
        }
    });
}, { rootMargin: "-30% 0px -60% 0px" });
sections.forEach(section => observer.observe(section));


/* Field-photo lightbox */
const photoModal = document.getElementById("photoModal");
const photoModalImage = document.getElementById("photoModalImage");
const photoModalCaption = document.getElementById("photoModalCaption");
const photoModalClose = document.getElementById("photoModalClose");

document.querySelectorAll(".gallery-card").forEach(card => {
    const openPhoto = () => {
        if (!photoModal || !photoModalImage) return;
        photoModalImage.src = card.dataset.photo;
        photoModalImage.alt = card.querySelector("img")?.alt || "Diamond Garden field photograph";
        if (photoModalCaption) photoModalCaption.textContent = "";
        photoModal.classList.add("show");
        photoModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
    };

    const img = card.querySelector("img");
    if (img) img.setAttribute("draggable", "false");
    card.setAttribute("aria-label", `Open photo: ${card.dataset.caption || "Diamond Garden field photograph"}`);
    card.addEventListener("click", openPhoto);
    card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPhoto();
        }
    });
});

function closePhotoModal() {
    if (!photoModal) return;
    photoModal.classList.remove("show");
    photoModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    photoModalImage.src = "";
}

photoModalClose?.addEventListener("click", closePhotoModal);
photoModal?.addEventListener("click", event => {
    if (event.target === photoModal) closePhotoModal();
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape") closePhotoModal();
});
