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
        window.matchMedia("(min-width: 769px) and (pointer: fine)").matches
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













/* ============================================================
   CALLBACK MODAL
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    const modal =
        document.querySelector("#callbackModal");

    if (!modal) return;


    const overlay =
        document.querySelector("#callbackModalOverlay");

    const closeButton =
        document.querySelector("#callbackModalClose");

    const form =
        document.querySelector("#callbackForm");

    const success =
        document.querySelector("#callbackSuccess");

    const error =
        document.querySelector("#callbackFormError");


    /* ========================================================
       OPEN
       ======================================================== */

    function openCallbackModal() {

        modal.classList.add("active");

        document.body.classList.add("callback-modal-open");

        document.body.style.overflow = "hidden";


        /*
         * Возвращаем форму,
         * если окно открывается повторно.
         */

        if (form) {
            form.style.display = "";
        }

        if (success) {
            success.classList.remove("active");
        }

        if (error) {
            error.textContent = "";
            error.classList.remove("visible");
        }


        /*
         * Подключаем телефонную маску.
         */

        const phoneInput =
            form?.querySelector('input[name="phone"]');

        if (
            phoneInput &&
            typeof $ !== "undefined" &&
            $.fn.mask
        ) {

            $(phoneInput).mask(
                "+7 (999) 999-99-99"
            );

        }


        /*
         * Фокус на имя.
         */

        setTimeout(() => {

            const nameInput =
                form?.querySelector('input[name="name"]');

            if (nameInput) {
                nameInput.focus();
            }

        }, 350);
    }


    /* ========================================================
       CLOSE
       ======================================================== */

    function closeCallbackModal() {

        modal.classList.remove("active");

        document.body.classList.remove(
            "callback-modal-open"
        );

        document.body.style.overflow = "";
    }


    /* ========================================================
       CALLBACK BUTTONS
       ======================================================== */

    /*
     * Можно поставить этот класс на любое количество кнопок.
     *
     * <a href="#" class="callback-trigger">
     * <button class="callback-trigger">
     */

    document
        .querySelectorAll(".callback-trigger")
        .forEach(button => {

            button.addEventListener("click", event => {

                event.preventDefault();

                openCallbackModal();

            });

        });


    /* ========================================================
       CLOSE BUTTON
       ======================================================== */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                closeCallbackModal();

            }
        );

    }


    /* ========================================================
       OVERLAY
       ======================================================== */

    if (overlay) {

        overlay.addEventListener(
            "click",
            closeCallbackModal
        );

    }


    /* ========================================================
       ESC
       ======================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("active")
            ) {

                closeCallbackModal();

            }

        }
    );


    /* ========================================================
       SUBMIT
       ======================================================== */

    if (form) {

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const name =
                    form.elements.name.value.trim();

                const phone =
                    form.elements.phone.value.trim();

                const personalConsent =
                    form.elements.personalConsent.checked;


                /* ------------------------------------------------
                   VALIDATION
                ------------------------------------------------ */

                if (
                    !name ||
                    !phone ||
                    !personalConsent
                ) {

                    if (error) {

                        error.textContent =
                            "Заполните имя, телефон и подтвердите согласие.";

                        error.classList.add("visible");

                    }

                    return;
                }


                /* ------------------------------------------------
                   BUTTON
                ------------------------------------------------ */

                const submitButton =
                    form.querySelector(
                        ".callback-submit"
                    );

                submitButton.disabled = true;

                submitButton.innerHTML =
                    "<span>Отправляем...</span>";


                /* ------------------------------------------------
                   PAYLOAD
                ------------------------------------------------ */

                const payload = {

                    type: "callback",

                    timestamp:
                        new Date().toISOString(),

                    name,

                    phone,

                    personalConsent,

                    marketingConsent: false,

                    source:
                        window.location.href

                };


                /* ------------------------------------------------
                   SEND
                ------------------------------------------------ */

                try {

                    const response =
                        await fetch(
                            "./quiz/quiz.json"
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Не удалось загрузить настройки"
                        );

                    }


                    const config =
                        await response.json();


                    const googleScriptUrl =
                        config.settings?.googleScriptUrl;


                    if (!googleScriptUrl) {

                        throw new Error(
                            "Google Apps Script URL не указан"
                        );

                    }


                    await fetch(
                        googleScriptUrl,
                        {
                            method: "POST",

                            mode: "no-cors",

                            headers: {
                                "Content-Type":
                                    "text/plain;charset=utf-8"
                            },

                            body:
                                JSON.stringify(payload)
                        }
                    );


                    /* ------------------------------------------------
                       SUCCESS
                    ------------------------------------------------ */

                    form.style.display = "none";


                    if (error) {
                        error.classList.remove(
                            "visible"
                        );
                    }


                    if (success) {
                        success.classList.add(
                            "active"
                        );
                    }


                } catch (submitError) {

                    console.error(
                        "Callback submit error:",
                        submitError
                    );


                    if (error) {

                        error.textContent =
                            "Не удалось отправить заявку. Попробуйте ещё раз.";

                        error.classList.add(
                            "visible"
                        );

                    }


                    submitButton.disabled = false;

                    submitButton.innerHTML = `
                        <span>Перезвоните мне</span>
                        <span>↗</span>
                    `;

                }

            }
        );

    }

});