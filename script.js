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

            <div class="modal-detail-box">
                <strong>Research basis</strong>
                <span id="modalBasis"></span>
            </div>

            <div class="modal-detail-box">
                <strong>What to observe</strong>
                <span id="modalObservation"></span>
            </div>

            <div class="modal-detail-box">
                <strong>Field survey</strong>
                <span id="modalSurvey"></span>
            </div>

            <img class="modal-facility-photo" id="modalFacilityPhoto" src="" alt="">
        </div>`;

    document.body.appendChild(modal);

    modal.addEventListener("click", event => {
        if (event.target === modal || event.target.closest(".facility-modal-close")) {
            closeFacilityModal();
        }
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

document.querySelectorAll(".nav-links a").forEach(link =>
    link.addEventListener("click", () => navLinks.classList.remove("open"))
);

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeFacilityModal();
});


/* Field-photo lightbox */

const photoModal = document.getElementById("photoModal");
const photoModalImage = document.getElementById("photoModalImage");
const photoModalCaption = document.getElementById("photoModalCaption");
const photoModalClose = document.getElementById("photoModalClose");

document.querySelectorAll(".gallery-card").forEach(card => {
    const openPhoto = () => {
        if (!photoModal || !photoModalImage) return;

        photoModalImage.src = card.dataset.photo;
        photoModalImage.alt =
            card.querySelector("img")?.alt ||
            "Diamond Garden field photograph";

        if (photoModalCaption) {
            photoModalCaption.textContent = "";
        }

        photoModal.classList.add("show");
        photoModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
    };

    const img = card.querySelector("img");

    if (img) img.setAttribute("draggable", "false");

    card.setAttribute(
        "aria-label",
        `Open photo: ${card.dataset.caption || "Diamond Garden field photograph"}`
    );

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
/* =========================================
   AUTHENTICATION + GARDEN TIMINGS
========================================= */

const API_BASE = "";


/* -----------------------------------------
   Helper: Show message
----------------------------------------- */
function showAuthMessage(elementId, message, type = "") {
    const element = document.getElementById(elementId);

    if (!element) return;

    element.textContent = message;
    element.className = "auth-message";

    if (type) {
        element.classList.add(type);
    }
}


/* -----------------------------------------
   Helper: API request
----------------------------------------- */
async function apiRequest(url, options = {}) {

    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    let data = {};

    try {
        data = await response.json();
    } catch (error) {
        data = {};
    }

    if (!response.ok) {
        throw new Error(
            data.message || "Something went wrong. Please try again."
        );
    }

    return data;
}


/* =========================================
   USER REGISTRATION
========================================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name = document
            .getElementById("registerName")
            .value
            .trim();

        const email = document
            .getElementById("registerEmail")
            .value
            .trim();

        const password = document
            .getElementById("registerPassword")
            .value;

        const confirmPassword = document
            .getElementById("registerConfirmPassword")
            .value;


        if (password !== confirmPassword) {

            showAuthMessage(
                "registerMessage",
                "Passwords do not match.",
                "error"
            );

            return;
        }


        if (password.length < 6) {

            showAuthMessage(
                "registerMessage",
                "Password must be at least 6 characters.",
                "error"
            );

            return;
        }


        showAuthMessage(
            "registerMessage",
            "Creating your account..."
        );


        try {

            const data = await apiRequest(
                "/api/auth/register",
                {
                    method: "POST",

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );


            showAuthMessage(
                "registerMessage",
                data.message || "Registration successful.",
                "success"
            );


            registerForm.reset();


            setTimeout(() => {

                window.location.hash = "login";

                const loginEmail =
                    document.getElementById("userLoginEmail");

                if (loginEmail) {
                    loginEmail.value = email;
                }

            }, 1000);


        } catch (error) {

            showAuthMessage(
                "registerMessage",
                error.message,
                "error"
            );

        }

    });
}


/* =========================================
   USER LOGIN
========================================= */

const userLoginForm = document.getElementById("userLoginForm");

if (userLoginForm) {

    userLoginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document
            .getElementById("userLoginEmail")
            .value
            .trim();

        const password = document
            .getElementById("userLoginPassword")
            .value;


        showAuthMessage(
            "userLoginMessage",
            "Signing in..."
        );


        try {

            const data = await apiRequest(
                "/api/auth/login",
                {
                    method: "POST",

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            localStorage.setItem(
                "diamondGardenUserToken",
                data.token
            );


            localStorage.setItem(
                "diamondGardenUser",
                JSON.stringify(data.user)
            );


            showAuthMessage(
                "userLoginMessage",
                `Welcome, ${data.user.name}. Login successful.`,
                "success"
            );


            userLoginForm.reset();


        } catch (error) {

            showAuthMessage(
                "userLoginMessage",
                error.message,
                "error"
            );

        }

    });
}


/* =========================================
   ADMIN LOGIN
========================================= */

const adminLoginForm = document.getElementById("adminLoginForm");

if (adminLoginForm) {

    adminLoginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document
            .getElementById("adminLoginEmail")
            .value
            .trim();

        const password = document
            .getElementById("adminLoginPassword")
            .value;


        showAuthMessage(
            "adminLoginMessage",
            "Checking administrator credentials..."
        );


        try {

            const data = await apiRequest(
                "/api/auth/admin-login",
                {
                    method: "POST",

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            localStorage.setItem(
                "diamondGardenAdminToken",
                data.token
            );


            localStorage.setItem(
                "diamondGardenAdmin",
                JSON.stringify(data.user)
            );


            showAuthMessage(
                "adminLoginMessage",
                "Administrator login successful.",
                "success"
            );


            adminLoginForm.reset();


            /*
             * Admin Dashboard will be connected
             * in the next step.
             */
            setTimeout(() => {

                window.location.hash = "admin-login";

            }, 500);


        } catch (error) {

            showAuthMessage(
                "adminLoginMessage",
                error.message,
                "error"
            );

        }

    });
}


/* =========================================
   LOAD GARDEN TIMINGS FROM DATABASE
========================================= */

async function loadGardenTimings() {

    try {

        const data = await apiRequest(
            "/api/timings",
            {
                method: "GET"
            }
        );


        const timings = data.timings;

        const morningOpen = formatTime(
            timings.morning_open
        );

        const morningClose = formatTime(
            timings.morning_close
        );

        const eveningOpen = formatTime(
            timings.evening_open
        );

        const eveningClose = formatTime(
            timings.evening_close
        );


        const morningElement =
            document.getElementById("morningTiming");

        const breakElement =
            document.getElementById("breakTiming");

        const eveningElement =
            document.getElementById("eveningTiming");


        if (morningElement) {

            morningElement.textContent =
                `${morningOpen} – ${morningClose}`;

        }


        if (breakElement) {

            breakElement.textContent =
                `${morningClose} – ${eveningOpen} • CLOSED`;

        }


        if (eveningElement) {

            eveningElement.textContent =
                `${eveningOpen} – ${eveningClose}`;

        }


    } catch (error) {

        console.error(
            "Unable to load garden timings:",
            error
        );

    }

}


/* -----------------------------------------
   Convert database time to AM/PM
----------------------------------------- */

function formatTime(timeString) {

    if (!timeString) {
        return "--";
    }


    const parts = timeString
        .toString()
        .split(":");


    let hours = Number(parts[0]);
    const minutes = parts[1] || "00";

    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;

    if (hours === 0) {
        hours = 12;
    }


    return `${hours}:${minutes} ${period}`;

}


/* =========================================
   CHECK STORED LOGIN SESSION
========================================= */

async function checkStoredSession() {

    const userToken =
        localStorage.getItem("diamondGardenUserToken");

    const adminToken =
        localStorage.getItem("diamondGardenAdminToken");


    if (userToken) {

        try {

            const data = await apiRequest(
                "/api/auth/me",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                }
            );


            localStorage.setItem(
                "diamondGardenUser",
                JSON.stringify(data.user)
            );


            console.log(
                `Logged in user: ${data.user.name}`
            );


        } catch (error) {

            localStorage.removeItem(
                "diamondGardenUserToken"
            );

            localStorage.removeItem(
                "diamondGardenUser"
            );

        }

    }


    if (adminToken) {

        try {

            const data = await apiRequest(
                "/api/auth/me",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${adminToken}`
                    }
                }
            );


            if (data.user.role !== "admin") {

                localStorage.removeItem(
                    "diamondGardenAdminToken"
                );

                localStorage.removeItem(
                    "diamondGardenAdmin"
                );

            } else {

                localStorage.setItem(
                    "diamondGardenAdmin",
                    JSON.stringify(data.user)
                );

            }


        } catch (error) {

            localStorage.removeItem(
                "diamondGardenAdminToken"
            );

            localStorage.removeItem(
                "diamondGardenAdmin"
            );

        }

    }

}


/* =========================================
   START AUTH / DATABASE FEATURES
========================================= */

loadGardenTimings();
checkStoredSession();

/* =========================================
   ADMIN DASHBOARD
========================================= */

function showAdminDashboard() {
    const dashboard = document.getElementById("admin-dashboard");

    if (!dashboard) return;

    dashboard.style.display = "block";

    // Make sure logout button exists every time
    // the admin dashboard is opened.
    setTimeout(() => {
        setupAdminLogoutButton();
    }, 50);
}

function hideAdminDashboard() {
    const dashboard = document.getElementById("admin-dashboard");

    if (!dashboard) return;

    dashboard.style.display = "none";
}


/* -----------------------------------------
   Load current timings into Admin Dashboard
----------------------------------------- */

async function loadAdminTimings() {
    try {
        const data = await apiRequest("/api/timings", {
            method: "GET"
        });

        const timings = data.timings;

        const morningOpen =
            document.getElementById("adminMorningOpen");

        const morningClose =
            document.getElementById("adminMorningClose");

        const eveningOpen =
            document.getElementById("adminEveningOpen");

        const eveningClose =
            document.getElementById("adminEveningClose");

        if (morningOpen) {
            morningOpen.value =
                timings.morning_open.substring(0, 5);
        }

        if (morningClose) {
            morningClose.value =
                timings.morning_close.substring(0, 5);
        }

        if (eveningOpen) {
            eveningOpen.value =
                timings.evening_open.substring(0, 5);
        }

        if (eveningClose) {
            eveningClose.value =
                timings.evening_close.substring(0, 5);
        }

    } catch (error) {
        console.error(
            "Unable to load admin timings:",
            error
        );
    }
}


/* -----------------------------------------
   Admin login success → Dashboard
----------------------------------------- */

const originalAdminLoginForm =
    document.getElementById("adminLoginForm");

if (originalAdminLoginForm) {

    originalAdminLoginForm.addEventListener(
        "submit",
        async (event) => {

            /*
             * The existing admin-login handler already performs
             * authentication and stores the admin token.
             *
             * This listener waits for the request to finish,
             * then checks whether the admin token exists.
             */

            setTimeout(async () => {

                const adminToken =
                    localStorage.getItem(
                        "diamondGardenAdminToken"
                    );

                if (!adminToken) {
                    return;
                }

                try {

                    const data = await apiRequest(
                        "/api/auth/me",
                        {
                            method: "GET",
                            headers: {
                                Authorization:
                                    `Bearer ${adminToken}`
                            }
                        }
                    );

                    if (data.user.role === "admin") {

                        /*
                         * Remove normal user session if an admin
                         * is currently signing in on the same browser.
                         */
                        localStorage.removeItem(
                            "diamondGardenUserToken"
                        );

                        localStorage.removeItem(
                            "diamondGardenUser"
                        );

                        showAdminDashboard();

                        await loadAdminTimings();

                        window.location.hash =
                            "admin-dashboard";
                    }

                } catch (error) {

                    console.error(
                        "Admin dashboard authentication error:",
                        error
                    );

                }

            }, 400);

        }
    );
}


/* -----------------------------------------
   Protect Dashboard on page load
----------------------------------------- */

async function verifyAdminDashboardAccess() {

    const adminToken =
        localStorage.getItem(
            "diamondGardenAdminToken"
        );

    if (!adminToken) {
        hideAdminDashboard();
        return;
    }

    try {

        const data = await apiRequest(
            "/api/auth/me",
            {
                method: "GET",
                headers: {
                    Authorization:
                        `Bearer ${adminToken}`
                }
            }
        );

        if (data.user.role !== "admin") {

            localStorage.removeItem(
                "diamondGardenAdminToken"
            );

            localStorage.removeItem(
                "diamondGardenAdmin"
            );

            hideAdminDashboard();
            return;
        }

        showAdminDashboard();

        await loadAdminTimings();

    } catch (error) {

        localStorage.removeItem(
            "diamondGardenAdminToken"
        );

        localStorage.removeItem(
            "diamondGardenAdmin"
        );

        hideAdminDashboard();

    }
}


/* -----------------------------------------
   Save Garden Timings
----------------------------------------- */

const timingsForm =
    document.getElementById("timingsForm");

if (timingsForm) {

    timingsForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const adminToken =
                localStorage.getItem(
                    "diamondGardenAdminToken"
                );

            if (!adminToken) {

                showAuthMessage(
                    "timingsAdminMessage",
                    "Administrator login required.",
                    "error"
                );

                return;
            }


            const morning_open =
                document.getElementById(
                    "adminMorningOpen"
                ).value;

            const morning_close =
                document.getElementById(
                    "adminMorningClose"
                ).value;

            const evening_open =
                document.getElementById(
                    "adminEveningOpen"
                ).value;

            const evening_close =
                document.getElementById(
                    "adminEveningClose"
                ).value;


            if (
                !morning_open ||
                !morning_close ||
                !evening_open ||
                !evening_close
            ) {

                showAuthMessage(
                    "timingsAdminMessage",
                    "Please fill all timing fields.",
                    "error"
                );

                return;
            }


            showAuthMessage(
                "timingsAdminMessage",
                "Saving garden timings..."
            );


            try {

                const data = await apiRequest(
                    "/api/timings",
                    {
                        method: "PUT",

                        headers: {
                            Authorization:
                                `Bearer ${adminToken}`
                        },

                        body: JSON.stringify({
                            morning_open,
                            morning_close,
                            evening_open,
                            evening_close
                        })
                    }
                );


                showAuthMessage(
                    "timingsAdminMessage",
                    data.message ||
                    "Garden timings updated successfully.",
                    "success"
                );


                /*
                 * Refresh public timing section
                 * immediately after saving.
                 */
                await loadGardenTimings();


            } catch (error) {

                showAuthMessage(
                    "timingsAdminMessage",
                    error.message,
                    "error"
                );

            }

        }
    );
}


/* -----------------------------------------
   Start dashboard protection
----------------------------------------- */

verifyAdminDashboardAccess();

/* =========================================
   ADMIN - MANAGE FACILITIES
========================================= */

async function loadAdminFacilities() {

    const list =
        document.getElementById("adminFacilitiesList");

    if (!list) return;

    const adminToken =
        localStorage.getItem("diamondGardenAdminToken");

    if (!adminToken) {
        list.innerHTML = `
            <p class="admin-loading">
                Administrator login required.
            </p>
        `;
        return;
    }

    list.innerHTML = `
        <p class="admin-loading">
            Loading facilities...
        </p>
    `;

    try {

        const data = await apiRequest(
            "/api/facilities",
            {
                method: "GET"
            }
        );

        const facilitiesFromDatabase =
            data.facilities || [];

        if (facilitiesFromDatabase.length === 0) {

            list.innerHTML = `
                <p class="admin-loading">
                    No facilities found.
                </p>
            `;

            return;
        }

        list.innerHTML =
            facilitiesFromDatabase.map(facility => `

                <div
                    class="admin-facility-item"
                    data-facility-id="${facility.id}"
                >

                    <h4>${escapeHtml(facility.name)}</h4>

                    <p>
                        ${escapeHtml(facility.description)}
                    </p>

                    <p>
                        <strong>Category:</strong>
                        ${escapeHtml(facility.category)}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${escapeHtml(facility.status)}
                    </p>

                    <button
                        type="button"
                        class="admin-facility-edit"
                        data-id="${facility.id}"
                    >
                        Edit Facility
                    </button>

                    <form
                        class="admin-facility-form"
                        data-form-id="${facility.id}"
                    >

                        <label>
                            Facility Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value="${escapeAttribute(facility.name)}"
                            required
                        >


                        <label>
                            Category
                        </label>

                        <select
                            name="category"
                            required
                        >

                            <option
                                value="recreation"
                                ${facility.category === "recreation" ? "selected" : ""}
                            >
                                Recreation
                            </option>

                            <option
                                value="comfort"
                                ${facility.category === "comfort" ? "selected" : ""}
                            >
                                Comfort
                            </option>

                            <option
                                value="safety"
                                ${facility.category === "safety" ? "selected" : ""}
                            >
                                Safety
                            </option>

                        </select>


                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            required
                        >${escapeHtml(facility.description)}</textarea>


                        <label>
                            Image Path
                        </label>

                        <input
                            type="text"
                            name="image"
                            value="${escapeAttribute(facility.image)}"
                            required
                        >


                        <label>
                            Status
                        </label>

                        <input
                            type="text"
                            name="status"
                            value="${escapeAttribute(facility.status)}"
                            required
                        >


                        <label>
                            Research Basis
                        </label>

                        <textarea
                            name="research_basis"
                            required
                        >${escapeHtml(facility.research_basis)}</textarea>


                        <label>
                            What to Observe
                        </label>

                        <textarea
                            name="what_to_observe"
                            required
                        >${escapeHtml(facility.what_to_observe)}</textarea>


                        <label>
                            Field Survey
                        </label>

                        <textarea
                            name="field_survey"
                            required
                        >${escapeHtml(facility.field_survey)}</textarea>


                        <div class="admin-form-buttons">

                            <button
                                type="submit"
                                class="admin-save-facility"
                            >
                                Save Changes
                            </button>

                            <button
                                type="button"
                                class="admin-cancel-facility"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            `).join("");


        attachFacilityAdminEvents();

    } catch (error) {

        console.error(
            "ADMIN FACILITIES LOAD ERROR:",
            error
        );

        list.innerHTML = `
            <p class="admin-loading">
                Unable to load facilities.
            </p>
        `;
    }
}


/* -----------------------------------------
   Attach Edit / Save / Cancel events
----------------------------------------- */

function attachFacilityAdminEvents() {

    document
        .querySelectorAll(".admin-facility-edit")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.id;

                    const form =
                        document.querySelector(
                            `.admin-facility-form[data-form-id="${id}"]`
                        );

                    if (!form) return;

                    form.classList.add("show");

                    button.style.display = "none";
                }
            );

        });


    document
        .querySelectorAll(".admin-cancel-facility")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const form =
                        button.closest(
                            ".admin-facility-form"
                        );

                    if (!form) return;

                    form.classList.remove("show");

                    const parent =
                        form.closest(
                            ".admin-facility-item"
                        );

                    const editButton =
                        parent?.querySelector(
                            ".admin-facility-edit"
                        );

                    if (editButton) {
                        editButton.style.display = "";
                    }

                }
            );

        });


    document
        .querySelectorAll(".admin-facility-form")
        .forEach(form => {

            form.addEventListener(
                "submit",
                async event => {

                    event.preventDefault();

                    const adminToken =
                        localStorage.getItem(
                            "diamondGardenAdminToken"
                        );

                    if (!adminToken) {

                        showAuthMessage(
                            "facilityAdminMessage",
                            "Administrator login required.",
                            "error"
                        );

                        return;
                    }


                    const id =
                        form.dataset.formId;


                    const formData =
                        new FormData(form);


                    const facilityData = {

                        name:
                            formData
                                .get("name")
                                .trim(),

                        category:
                            formData
                                .get("category"),

                        description:
                            formData
                                .get("description")
                                .trim(),

                        image:
                            formData
                                .get("image")
                                .trim(),

                        status:
                            formData
                                .get("status")
                                .trim(),

                        research_basis:
                            formData
                                .get("research_basis")
                                .trim(),

                        what_to_observe:
                            formData
                                .get("what_to_observe")
                                .trim(),

                        field_survey:
                            formData
                                .get("field_survey")
                                .trim()

                    };


                    showAuthMessage(
                        "facilityAdminMessage",
                        "Saving facility changes..."
                    );


                    try {

                        const data =
                            await apiRequest(
                                `/api/facilities/${id}`,
                                {
                                    method: "PUT",

                                    headers: {
                                        Authorization:
                                            `Bearer ${adminToken}`
                                    },

                                    body:
                                        JSON.stringify(
                                            facilityData
                                        )
                                }
                            );


                        showAuthMessage(
                            "facilityAdminMessage",
                            data.message ||
                            "Facility updated successfully.",
                            "success"
                        );


                        /*
                         * Update the existing client-side
                         * facility data so the public cards
                         * show the new information immediately.
                         */
                        const numericId =
                            Number(id);

                        if (
                            numericId >= 1 &&
                            numericId <= facilities.length
                        ) {

                            const localFacility =
                                facilities[
                                    numericId - 1
                                ];

                            if (localFacility) {

                                localFacility.name =
                                    data.facility.name;

                                localFacility.category =
                                    data.facility.category;

                                localFacility.text =
                                    data.facility.description;

                                localFacility.image =
                                    data.facility.image;

                                localFacility.status =
                                    data.facility.status;

                                localFacility.details.basis =
                                    data.facility.research_basis;

                                localFacility.details.observe =
                                    data.facility.what_to_observe;

                                localFacility.details.survey =
                                    data.facility.field_survey;
                            }
                        }


                        /*
                         * Refresh public facility cards.
                         */
                        renderFacilities();


                        /*
                         * Reload admin list so that the
                         * latest saved data is visible.
                         */
                        await loadAdminFacilities();


                    } catch (error) {

                        console.error(
                            "FACILITY SAVE ERROR:",
                            error
                        );

                        showAuthMessage(
                            "facilityAdminMessage",
                            error.message ||
                            "Unable to update facility.",
                            "error"
                        );

                    }

                }
            );

        });

}


/* -----------------------------------------
   Basic HTML escaping
----------------------------------------- */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {

    return escapeHtml(value);

}


/* -----------------------------------------
   Load facilities when Admin Dashboard opens
----------------------------------------- */

const existingAdminDashboard =
    document.getElementById(
        "admin-dashboard"
    );

if (existingAdminDashboard) {

    const adminToken =
        localStorage.getItem(
            "diamondGardenAdminToken"
        );

    if (adminToken) {
        loadAdminFacilities();
    }

}

/* =========================================
   ADMIN - MANAGE ISSUES
========================================= */

async function loadAdminIssues() {

    const list =
        document.getElementById("adminIssuesList");

    if (!list) return;

    const adminToken =
        localStorage.getItem("diamondGardenAdminToken");

    if (!adminToken) {
        list.innerHTML = `
            <p class="admin-loading">
                Administrator login required.
            </p>
        `;
        return;
    }

    list.innerHTML = `
        <p class="admin-loading">
            Loading issues...
        </p>
    `;

    try {

        const data =
            await apiRequest(
                "/api/issues",
                {
                    method: "GET"
                }
            );

        const issues =
            data.issues || [];


        if (issues.length === 0) {

            list.innerHTML = `
                <p class="admin-loading">
                    No issues found.
                </p>
            `;

            return;
        }


        list.innerHTML = issues.map(issue => `

            <div
                class="admin-facility-item"
                data-issue-id="${issue.id}"
            >

                <h4>
                    ${escapeHtml(issue.title)}
                </h4>

                <p>
                    ${escapeHtml(issue.description)}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${escapeHtml(issue.status)}
                </p>


                <button
                    type="button"
                    class="admin-facility-edit"
                    data-issue-id="${issue.id}"
                >
                    Edit Issue
                </button>


                <form
                    class="admin-facility-form"
                    data-issue-form-id="${issue.id}"
                >

                    <label>
                        Issue Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value="${escapeAttribute(issue.title)}"
                        required
                    >


                    <label>
                        Description & Improvement
                    </label>

                    <textarea
                        name="description"
                        required
                    >${escapeHtml(issue.description)}</textarea>


                    <label>
                        Status
                    </label>

                    <select
                        name="status"
                        required
                    >

                        <option
                            value="Observed"
                            ${issue.status === "Observed" ? "selected" : ""}
                        >
                            Observed
                        </option>

                        <option
                            value="Under Review"
                            ${issue.status === "Under Review" ? "selected" : ""}
                        >
                            Under Review
                        </option>

                        <option
                            value="Resolved"
                            ${issue.status === "Resolved" ? "selected" : ""}
                        >
                            Resolved
                        </option>

                    </select>


                    <div class="admin-form-buttons">

                        <button
                            type="submit"
                            class="admin-save-facility"
                        >
                            Save Changes
                        </button>

                        <button
                            type="button"
                            class="admin-cancel-facility"
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        `).join("");


        attachIssueAdminEvents();

    } catch (error) {

        console.error(
            "ADMIN ISSUES LOAD ERROR:",
            error
        );

        list.innerHTML = `
            <p class="admin-loading">
                Unable to load issues.
            </p>
        `;
    }
}


/* -----------------------------------------
   Edit / Save / Cancel
----------------------------------------- */

function attachIssueAdminEvents() {


    document
        .querySelectorAll(".admin-facility-edit[data-issue-id]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.issueId;

                    const form =
                        document.querySelector(
                            `.admin-facility-form[data-issue-form-id="${id}"]`
                        );

                    if (!form) return;

                    form.classList.add("show");

                    button.style.display = "none";

                }
            );

        });


    document
        .querySelectorAll(".admin-facility-form[data-issue-form-id] .admin-cancel-facility")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const form =
                        button.closest(
                            ".admin-facility-form"
                        );

                    if (!form) return;

                    form.classList.remove("show");

                    const parent =
                        form.closest(
                            ".admin-facility-item"
                        );

                    const editButton =
                        parent?.querySelector(
                            ".admin-facility-edit[data-issue-id]"
                        );

                    if (editButton) {
                        editButton.style.display = "";
                    }

                }
            );

        });


    document
        .querySelectorAll(".admin-facility-form[data-issue-form-id]")
        .forEach(form => {

            form.addEventListener(
                "submit",
                async event => {

                    event.preventDefault();


                    const adminToken =
                        localStorage.getItem(
                            "diamondGardenAdminToken"
                        );

                    if (!adminToken) {

                        showAuthMessage(
                            "issueAdminMessage",
                            "Administrator login required.",
                            "error"
                        );

                        return;
                    }


                    const id =
                        form.dataset.issueFormId;


                    const formData =
                        new FormData(form);


                    const issueData = {

                        title:
                            formData
                                .get("title")
                                .trim(),

                        description:
                            formData
                                .get("description")
                                .trim(),

                        status:
                            formData
                                .get("status")

                    };


                    showAuthMessage(
                        "issueAdminMessage",
                        "Saving issue changes..."
                    );


                    try {

                        const data =
                            await apiRequest(
                                `/api/issues/${id}`,
                                {
                                    method: "PUT",

                                    headers: {
                                        Authorization:
                                            `Bearer ${adminToken}`
                                    },

                                    body:
                                        JSON.stringify(
                                            issueData
                                        )
                                }
                            );


                        showAuthMessage(
                            "issueAdminMessage",
                            data.message ||
                            "Issue updated successfully.",
                            "success"
                        );


                        await loadAdminIssues();

                        await loadPublicIssues();


                    } catch (error) {

                        console.error(
                            "ISSUE SAVE ERROR:",
                            error
                        );

                        showAuthMessage(
                            "issueAdminMessage",
                            error.message ||
                            "Unable to update issue.",
                            "error"
                        );

                    }

                }
            );

        });

}


/* =========================================
   PUBLIC ISSUES FROM DATABASE
========================================= */

async function loadPublicIssues() {

    const grid =
        document.querySelector(
            "#issues .issues-grid"
        );

    if (!grid) return;


    try {

        const data =
            await apiRequest(
                "/api/issues",
                {
                    method: "GET"
                }
            );


        const issues =
            data.issues || [];


        grid.innerHTML =
            issues.map((issue, index) => `

                <article class="issue-placeholder">

                    <span class="issue-number">
                        ${String(index + 1).padStart(2, "0")}
                    </span>

                    <div>

                        <h3>
                            ${escapeHtml(issue.title)}
                        </h3>

                        <p>
                            ${escapeHtml(issue.description)}
                        </p>

                    </div>

                    <span class="status-pill">
                        ${escapeHtml(issue.status)}
                    </span>

                </article>

            `).join("");


    } catch (error) {

        console.error(
            "PUBLIC ISSUES LOAD ERROR:",
            error
        );

    }

}


/* =========================================
   INITIAL LOAD
========================================= */

const adminIssueToken =
    localStorage.getItem(
        "diamondGardenAdminToken"
    );

if (adminIssueToken) {

    loadAdminIssues();

}


/* Load database issues on public website */
loadPublicIssues();

/* =========================================
   PUBLIC FACILITIES FROM DATABASE
========================================= */

async function loadPublicFacilitiesFromDatabase() {

    try {

        const data = await apiRequest(
            "/api/facilities",
            {
                method: "GET"
            }
        );

        const databaseFacilities =
            data.facilities || [];

        databaseFacilities.forEach(dbFacility => {

            const index = Number(dbFacility.id) - 1;

            const localFacility =
                facilities[index];

            if (!localFacility) return;

            localFacility.name =
                dbFacility.name;

            localFacility.category =
                dbFacility.category;

            localFacility.text =
                dbFacility.description;

            localFacility.image =
                dbFacility.image;

            localFacility.status =
                dbFacility.status;

            localFacility.details.basis =
                dbFacility.research_basis;

            localFacility.details.observe =
                dbFacility.what_to_observe;

            localFacility.details.survey =
                dbFacility.field_survey;

        });


        const activeFilter =
            document.querySelector(
                ".filter-btn.active"
            )?.dataset.filter || "all";

        renderFacilities(activeFilter);

    } catch (error) {

        console.error(
            "PUBLIC FACILITIES DATABASE LOAD ERROR:",
            error
        );

    }

}


/* Load database facilities on page load */
loadPublicFacilitiesFromDatabase();

/* =========================================
   USER LOGOUT
========================================= */

function logoutUser() {

    localStorage.removeItem("diamondGardenUserToken");
    localStorage.removeItem("diamondGardenUser");

    showAuthMessage(
        "userLoginMessage",
        "You have been logged out.",
        "success"
    );

    const email =
        document.getElementById("userLoginEmail");

    const password =
        document.getElementById("userLoginPassword");

    if (email) {
        email.value = "";
    }

    if (password) {
        password.value = "";
    }

    updateUserLogoutButton();

    window.location.hash = "login";
}


function createUserLogoutButton() {

    if (document.getElementById("userLogoutButton")) {
        return;
    }

    const loginSection =
        document.getElementById("login");

    if (!loginSection) {
        return;
    }

    const heading =
        loginSection.querySelector(".section-heading");

    if (!heading) {
        return;
    }

    const button =
        document.createElement("button");

    button.id = "userLogoutButton";
    button.type = "button";
    button.className = "btn btn-ghost";
    button.textContent = "User Logout";
    button.style.marginTop = "18px";

    button.addEventListener(
        "click",
        logoutUser
    );

    heading.appendChild(button);
}


function updateUserLogoutButton() {

    const token =
        localStorage.getItem(
            "diamondGardenUserToken"
        );

    let button =
        document.getElementById(
            "userLogoutButton"
        );

    if (!button && token) {
        createUserLogoutButton();

        button =
            document.getElementById(
                "userLogoutButton"
            );
    }

    if (button) {

        button.style.display =
            token ? "inline-flex" : "none";
    }
}


/* =========================================
   ADMIN LOGOUT
========================================= */

function setupAdminLogoutButton() {

    const dashboard =
        document.getElementById(
            "admin-dashboard"
        );

    if (!dashboard) {
        return;
    }

    let button =
        document.getElementById(
            "adminLogoutButton"
        );


    /* If the button already exists in index.html,
       use that button. Otherwise create it. */

    if (!button) {

        const heading =
            dashboard.querySelector(
                ".section-heading"
            );

        if (!heading) {
            return;
        }

        button =
            document.createElement(
                "button"
            );

        button.id =
            "adminLogoutButton";

        button.type =
            "button";

        button.className =
            "btn btn-ghost";

        button.textContent =
            "Administrator Logout";

        button.style.marginTop =
            "18px";

        heading.appendChild(
            button
        );
    }


    /*
     * IMPORTANT:
     * Every time admin dashboard opens,
     * make the button visible again.
     */

    button.style.display =
        "inline-flex";


    /*
     * Prevent duplicate click listeners.
     */

    if (button.dataset.logoutReady === "true") {
        return;
    }


    button.dataset.logoutReady =
        "true";


    button.addEventListener(
        "click",
        logoutAdmin
    );
}


function logoutAdmin() {

    localStorage.removeItem(
        "diamondGardenAdminToken"
    );

    localStorage.removeItem(
        "diamondGardenAdmin"
    );


    const button =
        document.getElementById(
            "adminLogoutButton"
        );

    if (button) {
        button.style.display =
            "none";
    }


    hideAdminDashboard();


    showAuthMessage(
        "adminLoginMessage",
        "Administrator logged out successfully.",
        "success"
    );


    window.location.hash =
        "admin-login";
}


/* =========================================
   START LOGOUT UI
========================================= */

createUserLogoutButton();

updateUserLogoutButton();

setupAdminLogoutButton();

/* =========================================================
   DIAMOND GARDEN - FINAL ACCESS SYSTEM
   ========================================================= */

(function () {

    const USER_TOKEN_KEY = "diamondGardenUserToken";
    const USER_DATA_KEY = "diamondGardenUser";

    const ADMIN_TOKEN_KEY = "diamondGardenAdminToken";
    const ADMIN_DATA_KEY = "diamondGardenAdmin";

    const isAdminEntry =
        new URLSearchParams(window.location.search).get("administrator") === "1";


    /* =========================================================
       BASIC PAGE HELPERS
       ========================================================= */

    function hidePublicWebsite() {

        document.querySelectorAll(
            "body > header, body > footer"
        ).forEach(element => {
            element.style.display = "none";
        });

        const main = document.querySelector("main");

        if (!main) return;

        Array.from(main.children).forEach(section => {

            if (
                section.id !== "admin-login" &&
                section.id !== "admin-dashboard"
            ) {
                section.style.display = "none";
            }

        });
    }


    function showPublicWebsite() {

        document.querySelectorAll(
            "body > header, body > footer"
        ).forEach(element => {
            element.style.display = "";
        });

        const main = document.querySelector("main");

        if (!main) return;

        Array.from(main.children).forEach(section => {
            section.style.display = "";
        });

        const adminLogin =
            document.getElementById("admin-login");

        const adminDashboard =
            document.getElementById("admin-dashboard");

        if (adminLogin) {
            adminLogin.style.display = "none";
        }

        if (adminDashboard) {
            adminDashboard.style.display = "none";
        }

        document.body.classList.remove("admin-mode");
        document.body.classList.remove("admin-portal-mode");
        document.body.classList.remove("auth-locked");
    }


    function removeElement(id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.remove();
        }
    }


    /* =========================================================
       NORMAL USER LOGIN GATE
       ========================================================= */

    function createUserLoginGate() {

        removeElement("finalUserGate");

        const gate =
            document.createElement("div");

        gate.id = "finalUserGate";

        gate.innerHTML = `

            <div class="auth-gate-card">

                <div class="auth-gate-brand">

                    <div class="auth-gate-brand-mark">
                        DG
                    </div>

                    <strong>
                        Diamond Garden
                    </strong>

                </div>


                <div id="finalUserLoginBox">

                    <h2>
                        Welcome to Diamond Garden
                    </h2>

                    <p class="auth-gate-subtitle">
                        Please login to continue to the website.
                    </p>


                    <form
                        id="finalUserLoginForm"
                        class="auth-gate-form"
                    >

                        <label>
                            Email Address

                            <input
                                type="email"
                                id="finalUserEmail"
                                placeholder="Enter your email"
                                required
                            >
                        </label>


                        <label>
                            Password

                            <input
                                type="password"
                                id="finalUserPassword"
                                placeholder="Enter your password"
                                required
                            >
                        </label>


                        <button
                            type="submit"
                            class="btn btn-primary auth-gate-button"
                        >
                            User Login
                        </button>


                        <div
                            class="auth-gate-message"
                            id="finalUserLoginMessage"
                        ></div>

                    </form>


                    <div class="auth-gate-switch">

                        New user?

                        <button
                            type="button"
                            id="finalShowRegister"
                        >
                            Create Account
                        </button>

                    </div>

                </div>


                <div
                    id="finalUserRegisterBox"
                    class="auth-gate-register"
                >

                    <h2>
                        Create your account
                    </h2>

                    <p class="auth-gate-subtitle">
                        Register first, then login to access the website.
                    </p>


                    <form
                        id="finalUserRegisterForm"
                        class="auth-gate-form"
                    >

                        <label>
                            Full Name

                            <input
                                type="text"
                                id="finalRegisterName"
                                placeholder="Enter your name"
                                required
                            >
                        </label>


                        <label>
                            Email Address

                            <input
                                type="email"
                                id="finalRegisterEmail"
                                placeholder="Enter your email"
                                required
                            >
                        </label>


                        <label>
                            Password

                            <input
                                type="password"
                                id="finalRegisterPassword"
                                placeholder="Create a password"
                                required
                            >
                        </label>


                        <button
                            type="submit"
                            class="btn btn-primary auth-gate-button"
                        >
                            Register
                        </button>


                        <div
                            class="auth-gate-message"
                            id="finalRegisterMessage"
                        ></div>

                    </form>


                    <div class="auth-gate-switch">

                        Already registered?

                        <button
                            type="button"
                            id="finalShowLogin"
                        >
                            Back to Login
                        </button>

                    </div>

                </div>

            </div>

        `;

        document.body.appendChild(gate);


        const loginBox =
            document.getElementById("finalUserLoginBox");

        const registerBox =
            document.getElementById("finalUserRegisterBox");


        document
            .getElementById("finalShowRegister")
            .addEventListener("click", () => {

                loginBox.style.display = "none";
                registerBox.style.display = "block";

            });


        document
            .getElementById("finalShowLogin")
            .addEventListener("click", () => {

                registerBox.style.display = "none";
                loginBox.style.display = "block";

            });


        /* USER REGISTER */

        document
            .getElementById("finalUserRegisterForm")
            .addEventListener("submit", async function (event) {

                event.preventDefault();

                const message =
                    document.getElementById(
                        "finalRegisterMessage"
                    );

                const name =
                    document.getElementById(
                        "finalRegisterName"
                    ).value.trim();

                const email =
                    document.getElementById(
                        "finalRegisterEmail"
                    ).value.trim();

                const password =
                    document.getElementById(
                        "finalRegisterPassword"
                    ).value;

                message.textContent =
                    "Creating account...";


                try {

                    const response =
                        await fetch("/api/auth/register", {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name,
                                email,
                                password
                            })

                        });


                    let data = {};

                    try {
                        data =
                            await response.json();
                    } catch (error) {
                        data = {};
                    }


                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Registration failed."
                        );

                    }


                    message.textContent =
                        data.message ||
                        "Registration successful. Please login.";


                    document.getElementById(
                        "finalUserEmail"
                    ).value = email;


                    setTimeout(() => {

                        registerBox.style.display =
                            "none";

                        loginBox.style.display =
                            "block";

                        document.getElementById(
                            "finalUserPassword"
                        ).focus();

                    }, 700);


                } catch (error) {

                    message.textContent =
                        error.message;

                }

            });


        /* USER LOGIN */

        document
            .getElementById("finalUserLoginForm")
            .addEventListener("submit", async function (event) {

                event.preventDefault();

                const message =
                    document.getElementById(
                        "finalUserLoginMessage"
                    );

                const email =
                    document.getElementById(
                        "finalUserEmail"
                    ).value.trim();

                const password =
                    document.getElementById(
                        "finalUserPassword"
                    ).value;

                message.textContent =
                    "Logging in...";


                try {

                    const response =
                        await fetch("/api/auth/login", {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                password
                            })

                        });


                    let data = {};

                    try {
                        data =
                            await response.json();
                    } catch (error) {
                        data = {};
                    }


                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Login failed."
                        );

                    }


                    if (data.token) {

                        localStorage.setItem(
                            USER_TOKEN_KEY,
                            data.token
                        );

                    }


                    if (data.user) {

                        localStorage.setItem(
                            USER_DATA_KEY,
                            JSON.stringify(data.user)
                        );

                    }


                    /* Normal login should not open admin panel */

                    localStorage.removeItem(
                        ADMIN_TOKEN_KEY
                    );

                    localStorage.removeItem(
                        ADMIN_DATA_KEY
                    );


                    message.textContent =
                        data.message ||
                        "Login successful.";

                        setTimeout(() => {

    unlockNormalWebsite();

    window.history.replaceState(
        null,
        "",
        "/"
    );

    window.scrollTo(0, 0);

}, 400);


                } catch (error) {

                    message.textContent =
                        error.message;

                }

            });

    }


    function lockPublicWebsite() {

        showPublicWebsite();

        document.body.classList.add(
            "auth-locked"
        );

        createUserLoginGate();

    }


    /* =========================================================
       ADMIN CHOICE PAGE
       ========================================================= */

    function showAdminChoicePage() {

        hidePublicWebsite();

        document.body.classList.add(
            "admin-portal-mode"
        );

        removeElement("adminChoicePage");
        removeElement("finalUserGate");


        const adminLogin =
            document.getElementById("admin-login");

        const adminDashboard =
            document.getElementById("admin-dashboard");


        if (adminLogin) {
            adminLogin.style.display = "none";
        }

        if (adminDashboard) {
            adminDashboard.style.display = "none";
        }


        const page =
            document.createElement("div");

        page.id =
            "adminChoicePage";


        page.innerHTML = `

            <div
                style="
                    min-height:100vh;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    padding:25px;
                    background:
                    linear-gradient(
                        rgba(15,25,20,.55),
                        rgba(15,25,20,.55)
                    ),
                    url('assets/garden-walkway.jpg')
                    center/cover no-repeat;
                "
            >

                <div
                    class="auth-gate-card"
                    style="
                        text-align:center;
                    "
                >

                    <div
                        class="auth-gate-brand"
                        style="
                            justify-content:center;
                        "
                    >

                        <div
                            class="auth-gate-brand-mark"
                        >
                            DG
                        </div>

                        <strong>
                            Diamond Garden
                        </strong>

                    </div>


                    <h2>
                        Welcome
                    </h2>


                    <p
                        class="auth-gate-subtitle"
                    >
                        Select how you want to continue.
                    </p>


                    <div
                        style="
                            display:grid;
                            gap:12px;
                            margin-top:25px;
                        "
                    >

                        <button
                            type="button"
                            id="administratorLoginChoice"
                            class="btn btn-primary"
                            style="
                                width:100%;
                                justify-content:center;
                            "
                        >
                            Administrator Login
                        </button>


                        <button
                            type="button"
                            id="userLoginChoice"
                            class="btn btn-ghost"
                            style="
                                width:100%;
                                justify-content:center;
                            "
                        >
                            User Login
                        </button>

                    </div>


                    <p
                        style="
                            margin-top:18px;
                            font-size:11px;
                            color:var(--muted);
                        "
                    >
                        Administrator access is restricted.
                    </p>

                </div>

            </div>

        `;


        document.body.appendChild(page);


        /* ADMINISTRATOR LOGIN */

        document
            .getElementById("administratorLoginChoice")
            .addEventListener("click", () => {

                removeElement("adminChoicePage");

                const adminLogin =
                    document.getElementById(
                        "admin-login"
                    );

                if (!adminLogin) {

                    alert(
                        "Administrator login section not found."
                    );

                    return;

                }


                adminLogin.style.setProperty(
    "display",
    "flex",
    "important"
);


                hidePublicWebsite();


                /* IMPORTANT:
                   Existing admin form handler is stopped
                   and replaced by our clean handler.
                */

                setupAdministratorForm();

            });


        /* USER LOGIN */

        document
            .getElementById("userLoginChoice")
            .addEventListener("click", () => {

                removeElement("adminChoicePage");

                localStorage.removeItem(
                    ADMIN_TOKEN_KEY
                );

                localStorage.removeItem(
                    ADMIN_DATA_KEY
                );


                window.history.replaceState(
                    null,
                    "",
                    "/"
                );


                document.body.classList.remove(
                    "admin-portal-mode"
                );


                lockPublicWebsite();

            });

    }


    /* =========================================================
       ADMINISTRATOR LOGIN
       ========================================================= */

    function setupAdministratorForm() {

        const form =
            document.getElementById(
                "adminLoginForm"
            );

        if (!form) {

            console.log(
                "Admin login form not found."
            );

            return;

        }


        if (
            form.dataset.finalAdminHandler ===
            "true"
        ) {
            return;
        }


        form.dataset.finalAdminHandler =
            "true";


        /* CAPTURE PHASE:
           This stops the old admin-login
           listener from redirecting us to
           normal user login.
        */

        form.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                event.stopImmediatePropagation();


                const emailInput =
                    form.querySelector(
                        'input[type="email"]'
                    );

                const passwordInput =
                    form.querySelector(
                        'input[type="password"]'
                    );


                const message =
                    document.getElementById(
                        "adminLoginMessage"
                    );


                const email =
                    emailInput
                        ? emailInput.value.trim()
                        : "";


                const password =
                    passwordInput
                        ? passwordInput.value
                        : "";


                if (message) {
                    message.textContent =
                        "Logging in...";
                }


                try {

                    const response =
                        await fetch(
                            "/api/auth/admin-login",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    email,
                                    password
                                })
                            }
                        );


                    let data = {};

                    try {
                        data =
                            await response.json();
                    } catch (error) {
                        data = {};
                    }


                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Administrator login failed."
                        );

                    }


                    if (data.token) {

                        localStorage.setItem(
                            ADMIN_TOKEN_KEY,
                            data.token
                        );

                    }


                    if (data.admin) {

                        localStorage.setItem(
                            ADMIN_DATA_KEY,
                            JSON.stringify(data.admin)
                        );

                    }


                    localStorage.removeItem(
                        USER_TOKEN_KEY
                    );

                    localStorage.removeItem(
                        USER_DATA_KEY
                    );


                    if (message) {

                        message.textContent =
                            data.message ||
                            "Administrator login successful.";

                    }


                    setTimeout(() => {

                        openAdminDashboard();

                    }, 350);


                } catch (error) {

                    if (message) {

                        message.textContent =
                            error.message;

                    }

                }


            },
            true
        );

    }


    /* =========================================================
       ADMIN DASHBOARD
       ========================================================= */

    function openAdminDashboard() {

        removeElement(
            "adminChoicePage"
        );

        removeElement(
            "finalUserGate"
        );


        document.body.classList.remove(
            "auth-locked"
        );

        document.body.classList.add(
            "admin-portal-mode"
        );


        hidePublicWebsite();


        const adminLogin =
            document.getElementById(
                "admin-login"
            );

        const dashboard =
            document.getElementById(
                "admin-dashboard"
            );


        if (adminLogin) {
            adminLogin.style.display = "none";
        }


        if (dashboard) {

    dashboard.style.setProperty(
        "display",
        "block",
        "important"
    );

    dashboard.scrollIntoView({
        behavior: "instant",
        block: "start"
    });

}


        const logoutButton =
            document.getElementById(
                "adminLogoutButton"
            );


        if (logoutButton) {

            logoutButton.style.display =
                "inline-flex";


            if (
                logoutButton.dataset.finalAdminLogout !==
                "true"
            ) {

                logoutButton.dataset.finalAdminLogout =
                    "true";


                logoutButton.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopImmediatePropagation();


                        localStorage.removeItem(
                            ADMIN_TOKEN_KEY
                        );

                        localStorage.removeItem(
                            ADMIN_DATA_KEY
                        );


                        window.history.replaceState(
                            null,
                            "",
                            "/?administrator=1"
                        );


                        showAdminChoicePage();

                    },
                    true
                );

            }

        }


        /* Reload existing admin dashboard data */

        if (
            typeof loadAdminTimings ===
            "function"
        ) {
            loadAdminTimings();
        }


        if (
            typeof loadAdminFacilities ===
            "function"
        ) {
            loadAdminFacilities();
        }


        if (
            typeof loadAdminIssues ===
            "function"
        ) {
            loadAdminIssues();
        }

        if (typeof loadAdminVisitors === "function") {
    loadAdminVisitors();
}

    }

    // =========================================================
// LOAD VISITOR DATA - ADMIN ONLY
// =========================================================
async function loadAdminVisitors() {

    const totalVisitorsCount =
        document.getElementById("totalVisitorsCount");

    const totalVisitsCount =
        document.getElementById("totalVisitsCount");

    const visitorTableBody =
        document.getElementById("visitorTableBody");

    const visitorMessage =
        document.getElementById("visitorAdminMessage");


    if (!visitorTableBody) {
        return;
    }


    visitorTableBody.innerHTML = `
        <tr>
            <td
                colspan="4"
                style="padding:20px; text-align:center;"
            >
                Loading visitor data...
            </td>
        </tr>
    `;


    try {

        const token =
            localStorage.getItem(ADMIN_TOKEN_KEY);


        if (!token) {
            throw new Error(
                "Administrator session not found."
            );
        }


        const response = await fetch(
            "/api/admin/visitors",
            {
                method: "GET",

                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );


        let data = {};

        try {
            data = await response.json();
        } catch (error) {
            data = {};
        }


        if (!response.ok) {
            throw new Error(
                data.message ||
                "Unable to load visitor data."
            );
        }


        // -------------------------
        // STATISTICS
        // -------------------------

        if (totalVisitorsCount) {
            totalVisitorsCount.textContent =
                data.totalVisitors ?? 0;
        }


        if (totalVisitsCount) {
            totalVisitsCount.textContent =
                data.totalVisits ?? 0;
        }


        // -------------------------
        // TABLE
        // -------------------------

        const visitors =
            Array.isArray(data.visitors)
                ? data.visitors
                : [];


        if (visitors.length === 0) {

            visitorTableBody.innerHTML = `
                <tr>
                    <td
                        colspan="4"
                        style="
                            padding:20px;
                            text-align:center;
                        "
                    >
                        No visitor records found.
                    </td>
                </tr>
            `;

            return;
        }


        visitorTableBody.innerHTML =
            visitors.map(visitor => {

                const lastVisit =
                    visitor.last_visit
                        ? new Date(
                            visitor.last_visit
                          ).toLocaleString(
                              "en-IN",
                              {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                              }
                          )
                        : "N/A";


                return `
                    <tr>

                        <td
                            style="
                                padding:12px;
                                border-top:1px solid #eee;
                            "
                        >
                            ${escapeHtml(
                                visitor.user_name || "N/A"
                            )}
                        </td>


                        <td
                            style="
                                padding:12px;
                                border-top:1px solid #eee;
                            "
                        >
                            ${escapeHtml(
                                visitor.user_email || "N/A"
                            )}
                        </td>


                        <td
                            style="
                                padding:12px;
                                border-top:1px solid #eee;
                            "
                        >
                            ${visitor.total_visits || 0}
                        </td>


                        <td
                            style="
                                padding:12px;
                                border-top:1px solid #eee;
                            "
                        >
                            ${lastVisit}
                        </td>

                    </tr>
                `;
            }).join("");


    } catch (error) {

        console.error(
            "VISITOR LOAD ERROR:",
            error
        );


        visitorTableBody.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    style="
                        padding:20px;
                        text-align:center;
                    "
                >
                    Unable to load visitor data.
                </td>
            </tr>
        `;


        if (visitorMessage) {
            visitorMessage.textContent =
                error.message;
        }
    }
}


    /* =========================================================
       INITIAL PAGE
       ========================================================= */

    function initializeFinalAccess() {

        if (isAdminEntry) {

            /* Always start clean */

            localStorage.removeItem(
                USER_TOKEN_KEY
            );

            localStorage.removeItem(
                USER_DATA_KEY
            );

            localStorage.removeItem(
                ADMIN_TOKEN_KEY
            );

            localStorage.removeItem(
                ADMIN_DATA_KEY
            );


            /*
               Remove any old hash such as
               #admin-login or #login.
            */

            window.history.replaceState(
                null,
                "",
                "/?administrator=1"
            );


            setTimeout(() => {

                showAdminChoicePage();

            }, 150);

            return;

        }


        /* NORMAL PUBLIC SITE */

        const userToken =
            localStorage.getItem(
                USER_TOKEN_KEY
            );


        if (userToken) {

            unlockNormalWebsite();

        } else {

            lockPublicWebsite();

        }

    }


    function unlockNormalWebsite() {

    removeElement(
        "finalUserGate"
    );

    document.body.classList.remove(
        "auth-locked"
    );

    document.body.classList.remove(
        "admin-portal-mode"
    );

    showPublicWebsite();


    /* =====================================================
       CREATE USER LOGOUT BUTTON
       ===================================================== */

    const navLinks =
        document.getElementById(
            "navLinks"
        );

    if (
        navLinks &&
        !document.getElementById(
            "userLogoutItem"
        )
    ) {

        const logoutItem =
            document.createElement(
                "li"
            );

        logoutItem.id =
            "userLogoutItem";

        logoutItem.innerHTML = `
            <a
                href="#"
                id="userLogoutButton"
            >
                Logout
            </a>
        `;

        navLinks.appendChild(
            logoutItem
        );


        const logoutButton =
            document.getElementById(
                "userLogoutButton"
            );


        logoutButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopImmediatePropagation();


                localStorage.removeItem(
                    USER_TOKEN_KEY
                );

                localStorage.removeItem(
                    USER_DATA_KEY
                );


                const logoutItem =
                    document.getElementById(
                        "userLogoutItem"
                    );

                if (logoutItem) {
                    logoutItem.remove();
                }


                lockPublicWebsite();


                window.scrollTo(
                    0,
                    0
                );

            },
            true
        );

    }


    window.scrollTo(
        0,
        0
    );

}


    /* =========================================================
       START
       ========================================================= */

    setTimeout(() => {

        initializeFinalAccess();

    }, 500);

    /* =========================================================
   FINAL PUBLIC WEBSITE CLEANUP + USER LOGOUT FIX
   ========================================================= */

function cleanPublicAuthUI() {

    /* Remove old login/register sections if present */
    const oldAuthSelectors = [
        "#login",
        "#register",
        "#user-login",
        "#user-register",
        "#login-section",
        "#register-section",
        "#user-login-section",
        "#user-register-section"
    ];

    oldAuthSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            if (
                !element.closest("#finalUserGate") &&
                !element.closest("#adminChoicePage") &&
                !element.closest("#admin-login") &&
                !element.closest("#admin-dashboard")
            ) {
                element.remove();
            }
        });
    });


    /* Remove old public login/admin buttons */
    document.querySelectorAll("a, button").forEach(element => {

        const text =
            element.textContent
                .trim()
                .toLowerCase();

        if (
            (
                text === "user login" ||
                text === "administrator login" ||
                text === "create account"
            ) &&
            !element.closest("#finalUserGate") &&
            !element.closest("#adminChoicePage") &&
            !element.closest("#admin-login") &&
            !element.closest("#admin-dashboard")
        ) {
            element.remove();
        }

    });

}


/* =========================================================
   IMMEDIATE USER LOGOUT
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const clickedElement =
            event.target.closest(
                "#userLogoutButton, #userLogout"
            );

        if (!clickedElement) {
            return;
        }


        event.preventDefault();
        event.stopImmediatePropagation();


        localStorage.removeItem(
            "diamondGardenUserToken"
        );

        localStorage.removeItem(
            "diamondGardenUser"
        );


        /* Immediately lock the public website */
        if (isAdminEntry) {
    window.history.replaceState(null, "", "/?administrator=1");
    showAdminChoicePage();
} else {
    lockPublicWebsite();
}

        window.scrollTo(
            0,
            0
        );

    },
    true
);


/* Clean public website whenever normal access is unlocked */
const originalUnlockNormalWebsite =
    unlockNormalWebsite;

unlockNormalWebsite = function () {

    originalUnlockNormalWebsite();

    setTimeout(() => {

        cleanPublicAuthUI();

    }, 50);

};


/* Clean once on normal page load */
setTimeout(() => {

    if (
        !window.location.search.includes(
            "administrator=1"
        )
    ) {
        cleanPublicAuthUI();
    }

}, 700);

})();
