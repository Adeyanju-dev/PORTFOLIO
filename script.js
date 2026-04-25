const menuToggle = document.getElementById("menuToggle");
const navPanel = document.getElementById("siteMenu");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav-links a");
const backToTop = document.getElementById("backToTopBtn");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const revealItems = document.querySelectorAll("[data-reveal]");
const yearNode = document.getElementById("year");

if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
}

if (menuToggle && navPanel) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navPanel.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navPanel.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const targetId = button.dataset.tabTarget;

        tabButtons.forEach((item) => {
            item.classList.remove("active");
            item.setAttribute("aria-selected", "false");
        });

        tabPanels.forEach((panel) => {
            const isActive = panel.id === targetId;
            panel.classList.toggle("active", isActive);
            panel.hidden = !isActive;
        });

        button.classList.add("active");
        button.setAttribute("aria-selected", "true");
    });
});

revealItems.forEach((item) => {
    const delay = item.dataset.delay;
    if (delay) {
        item.style.setProperty("--delay", `${delay}ms`);
    }
});

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.18,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("revealed"));
}

const updateScrollUI = () => {
    const scrolled = window.scrollY > 24;
    if (nav) {
        nav.classList.toggle("is-scrolled", scrolled);
    }

    if (backToTop) {
        backToTop.classList.toggle("visible", window.scrollY > 420);
    }
};

updateScrollUI();
window.addEventListener("scroll", updateScrollUI, { passive: true });

const scriptURL = "https://script.google.com/macros/s/AKfycbyEJAw6A8DMnFV7L8-27fJExp7UgUi_QdvHhZH6TDEEoKmzSq3PurDKHn2QK3WOMb-u/exec";
const form = document.forms["submit-to-google-sheet"];
const msg = document.getElementById("msg");

if (form && msg) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        msg.textContent = "Sending...";

        try {
            await fetch(scriptURL, {
                method: "POST",
                body: new FormData(form)
            });

            msg.textContent = "Message sent successfully.";
            form.reset();
        } catch (error) {
            msg.textContent = "Something went wrong. Please try again.";
        }

        window.setTimeout(() => {
            msg.textContent = "";
        }, 4500);
    });
}
