document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const header = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const cursorGlow = document.getElementById("cursorGlow");

    const mobileLinks = document.querySelectorAll(".mobile-nav-link");
    const navLinks = document.querySelectorAll(
        '.nav-link, .mobile-nav-link, .hero-primary-button, .header-button, .mobile-menu-cta'
    );


    /* =====================================================
       HEADER — SCROLL STATE
    ===================================================== */

    const updateHeader = () => {

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    };

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const openMenu = () => {

        menuToggle.classList.add("active");

        mobileMenu.classList.add("active");

        document.body.classList.add("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Закрыть меню"
        );

    };


    const closeMenu = () => {

        menuToggle.classList.remove("active");

        mobileMenu.classList.remove("active");

        document.body.classList.remove("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Открыть меню"
        );

    };


    menuToggle.addEventListener("click", () => {

        if (mobileMenu.classList.contains("active")) {
            closeMenu();
        } else {
            openMenu();
        }

    });


    /* =====================================================
       CLOSE MOBILE MENU AFTER NAVIGATION
    ===================================================== */

    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {

            closeMenu();

        });

    });


    /* =====================================================
       ESC CLOSE
    ===================================================== */

    document.addEventListener("keydown", event => {

        if (
            event.key === "Escape" &&
            mobileMenu.classList.contains("active")
        ) {
            closeMenu();
        }

    });


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener("resize", () => {

        if (
            window.innerWidth > 800 &&
            mobileMenu.classList.contains("active")
        ) {
            closeMenu();
        }

    });


    /* =====================================================
       CURSOR LIGHT
    ===================================================== */

    let mouseX = 0;
    let mouseY = 0;

    let glowX = 0;
    let glowY = 0;

    let cursorVisible = false;


    if (window.matchMedia("(pointer: fine)").matches) {

        document.addEventListener("mousemove", event => {

            mouseX = event.clientX;
            mouseY = event.clientY;

            cursorVisible = true;

            cursorGlow.style.opacity = "1";

        });


        document.addEventListener("mouseleave", () => {

            cursorVisible = false;

            cursorGlow.style.opacity = "0";

        });


        const animateCursor = () => {

            if (cursorVisible) {

                glowX += (mouseX - glowX) * 0.08;
                glowY += (mouseY - glowY) * 0.08;

                cursorGlow.style.left = `${glowX}px`;
                cursorGlow.style.top = `${glowY}px`;

            }

            requestAnimationFrame(animateCursor);

        };

        animateCursor();

    }


    /* =====================================================
       HERO PARALLAX
    ===================================================== */

    const hero = document.querySelector(".hero");
    const heroImage = document.querySelector(".hero-image");

    if (
        hero &&
        heroImage &&
        window.matchMedia("(pointer: fine)").matches
    ) {

        hero.addEventListener("mousemove", event => {

            const rect = hero.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width -
                0.5;

            const y =
                (event.clientY - rect.top) /
                rect.height -
                0.5;

            const moveX = x * 10;
            const moveY = y * 7;

            heroImage.style.transform =
                `scale(1.045) translate(${moveX}px, ${moveY}px)`;

        });


        hero.addEventListener("mouseleave", () => {

            heroImage.style.transform =
                "scale(1.03) translate(0, 0)";

        });

    }


    /* =====================================================
       ACTIVE NAV ON SCROLL
    ===================================================== */

    const sections = document.querySelectorAll(
        "section[id]"
    );

    const observerOptions = {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
    };


    const sectionObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const id = entry.target.id;

                    document
                        .querySelectorAll(".nav-link")
                        .forEach(link => {

                            link.classList.remove("active");

                            if (
                                link.getAttribute("href") ===
                                `#${id}`
                            ) {
                                link.classList.add("active");
                            }

                        });

                });

            },
            observerOptions
        );


    sections.forEach(section => {

        sectionObserver.observe(section);

    });


    /* =====================================================
       SMOOTH ANCHOR OFFSET
    ===================================================== */

    navLinks.forEach(link => {

        link.addEventListener("click", event => {

            const href =
                link.getAttribute("href");

            if (
                !href ||
                !href.startsWith("#") ||
                href === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(href);

            if (!target) {
                return;
            }

            event.preventDefault();

            const headerHeight =
                header.offsetHeight;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

            closeMenu();

        });

    });


    /* =====================================================
       HERO ENTRANCE
    ===================================================== */

    window.requestAnimationFrame(() => {

        document.body.classList.add("page-ready");

    });

});