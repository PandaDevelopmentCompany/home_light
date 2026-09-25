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

    if (hero && heroImage) {

        const desktopPointer =
            window.matchMedia("(hover: hover) and (pointer: fine)");

        if (desktopPointer.matches) {

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

        } else {

            /* Мобильные и touch-устройства */

            heroImage.style.transform = "none";
            heroImage.style.transition = "none";

        }

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





















/* =========================================================
   PROJECTS GALLERY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const projectMainImage =
        document.getElementById("projectMainImage");

    const projectImageButton =
        document.getElementById("projectImageButton");

    const projectCurrentImage =
        document.getElementById("projectCurrentImage");

    const projectTotalImages =
        document.getElementById("projectTotalImages");

    const projectNumber =
        document.getElementById("projectNumber");

    const projectName =
        document.getElementById("projectName");

    const projectYear =
        document.getElementById("projectYear");

    const projectDescription =
        document.getElementById("projectDescription");

    const projectStats =
        document.getElementById("projectStats");

    const projectThumbnails =
        document.getElementById("projectThumbnails");

    const projectPrev =
        document.getElementById("projectPrev");

    const projectNext =
        document.getElementById("projectNext");

    const filters =
        document.querySelectorAll(".project-filter");

    const projectsVisibleCount =
        document.getElementById("projectsVisibleCount");



    /* =====================================================
       PROJECT DATA

       Здесь потом можно спокойно менять
       названия, фотографии, категории и описание.
    ===================================================== */

    const projects = [

        {
            title: "Дом в Тишнево",

            year: "2026",

            categories: [
                "neon",
                "garland",
                "combined"
            ],

            description:
                "Комбинированная подсветка фасада, " +
                "веранд и архитектурных элементов дома.",

            stats: [
                "45 м.п. — Неон + Бахрома",
                "15 м.п. — гибкий Неон",
                "Wi-Fi управление"
            ],

            images: [
                "img/work/work_1.jpg",
                "img/work/work_2.jpg",
                "img/work/work_3.jpg",
                "img/work/work_4.jpg"
            ]
        },


        {
            title: "Дом в Удачном",

            year: "2026",

            categories: [
                "neon",
                "garland",
                "combined"
            ],

            description:
                "Выразительная подсветка дома и беседки " +
                "с акцентом на архитектурные линии.",

            stats: [
                "65 м.п. — гибкий Неон",
                "12 м.п. — Бахрома",
                "24 м.п. — Неон для беседки"
            ],

            images: [
                "img/work/work_5.jpg",
                "img/work/work_6.jpg",
                "img/work/work_7.jpg",
                "img/work/work_8.jpg"
            ]
        },


        {
            title: "Дом в Емельяново",

            year: "2026",

            categories: [
                "garland",
                "combined"
            ],

            description:
                "Праздничное оформление дома, ели " +
                "и территории световыми конструкциями.",

            stats: [
                "60 м.п. — Бахрома",
                "25 м.п. — Нить",
                "3 световые конструкции"
            ],

            images: [
                "img/work/work_9.jpg",
                "img/work/work_10.jpg",
                "img/work/work_11.jpg",
                "img/work/work_12.jpg"
            ]
        },


        {
            title: "Таунхаус Опушкино",

            year: "2026",

            categories: [
                "garland",
                "neon"
            ],

            description:
                "Лаконичная подсветка таунхауса, " +
                "веранды, гаража и входной группы.",

            stats: [
                "35 м.п. — Бахрома",
                "34 м.п. — Бахрома",
                "20 м.п. — гибкий Неон"
            ],

            images: [
                "img/work/work_13.jpg",
                "img/work/work_14.jpg",
                "img/work/work_15.jpg",
                "img/work/work_16.jpg"
            ]
        },


        {
            title: "Дом в Жуковском",

            year: "2026",

            categories: [
                "garland",
                "architecture",
                "combined"
            ],

            description:
                "Масштабный проект с комбинированной " +
                "подсветкой дома, деревьев и парковочной зоны.",

            stats: [
                "75 м.п. — Неон + Бахрома",
                "200 м.п. — Нить для елей",
                "100 м — Белт-Лайт"
            ],

            images: [
                "img/work/work_17.jpg",
                "img/work/work_18.jpg",
                "img/work/work_19.jpg",
                "img/work/work_20.jpg"
            ]
        }

    ];



    /* =====================================================
       STATE
    ===================================================== */

    let filteredProjects = [...projects];

    let currentProjectIndex = 0;

    let currentImageIndex = 0;



    /* =====================================================
       HELPERS
    ===================================================== */

    function padNumber(number) {

        return String(number).padStart(2, "0");

    }



    /* =====================================================
       RENDER STATS
    ===================================================== */

    function renderStats(project) {

        if (!projectStats) return;

        projectStats.innerHTML = "";

        project.stats.forEach(stat => {

            const element =
                document.createElement("div");

            element.className =
                "project-stat";

            element.textContent =
                stat;

            projectStats.appendChild(element);

        });

    }



    /* =====================================================
       RENDER THUMBNAILS
    ===================================================== */

    function renderThumbnails(project) {

        if (!projectThumbnails) return;

        projectThumbnails.innerHTML = "";

        project.images.forEach(
            (image, index) => {

                const button =
                    document.createElement("button");

                button.type = "button";

                button.className =
                    "project-thumbnail";

                if (index === currentImageIndex) {
                    button.classList.add("active");
                }

                button.setAttribute(
                    "aria-label",
                    `Фотография ${index + 1}`
                );


                const img =
                    document.createElement("img");

                img.src = image;

                img.alt =
                    `${project.title} — фото ${index + 1}`;

                img.loading =
                    index === 0
                        ? "eager"
                        : "lazy";

                img.decoding =
                    "async";


                button.appendChild(img);

                button.addEventListener(
                    "click",
                    () => {

                        currentImageIndex = index;

                        updateProjectImage();

                    }
                );


                projectThumbnails.appendChild(button);

            }
        );

    }



    /* =====================================================
       UPDATE MAIN IMAGE
    ===================================================== */

    function updateProjectImage(
        animate = true
    ) {

        const project =
            filteredProjects[currentProjectIndex];

        if (!project) return;


        const image =
            project.images[currentImageIndex];



        if (animate) {

            projectMainImage.style.opacity = "0";

            projectMainImage.style.transform =
                "scale(1.025)";


            setTimeout(() => {

                projectMainImage.src =
                    image;

                projectMainImage.alt =
                    `${project.title} — фото ${currentImageIndex + 1}`;

                projectMainImage.style.opacity =
                    "1";

                projectMainImage.style.transform =
                    "scale(1.001)";

            }, 180);

        } else {

            projectMainImage.src =
                image;

            projectMainImage.alt =
                `${project.title} — фото ${currentImageIndex + 1}`;

        }



        projectCurrentImage.textContent =
            padNumber(currentImageIndex + 1);

        projectTotalImages.textContent =
            padNumber(project.images.length);



        renderThumbnails(project);

    }



    /* =====================================================
       UPDATE PROJECT
    ===================================================== */

    function renderProject(
        animate = false
    ) {

        const project =
            filteredProjects[currentProjectIndex];

        if (!project) return;


        currentImageIndex = 0;


        if (animate) {

            projectName.style.opacity = "0";
            projectDescription.style.opacity = "0";
            projectStats.style.opacity = "0";


            setTimeout(() => {

                projectName.textContent =
                    project.title;

                projectYear.textContent =
                    project.year;

                projectNumber.textContent =
                    padNumber(
                        projects.indexOf(project) + 1
                    );

                projectDescription.textContent =
                    project.description;


                renderStats(project);

                projectName.style.opacity = "1";
                projectDescription.style.opacity = "1";
                projectStats.style.opacity = "1";


                updateProjectImage(false);

            }, 180);

        } else {

            projectName.textContent =
                project.title;

            projectYear.textContent =
                project.year;

            projectNumber.textContent =
                padNumber(
                    projects.indexOf(project) + 1
                );

            projectDescription.textContent =
                project.description;


            renderStats(project);

            updateProjectImage(false);

        }

    }



    /* =====================================================
       PROJECT NAVIGATION
    ===================================================== */

    function nextProject() {

        if (!filteredProjects.length) return;

        currentProjectIndex =
            (currentProjectIndex + 1) %
            filteredProjects.length;

        renderProject(true);

    }



    function previousProject() {

        if (!filteredProjects.length) return;

        currentProjectIndex =
            (
                currentProjectIndex -
                1 +
                filteredProjects.length
            ) %
            filteredProjects.length;

        renderProject(true);

    }



    /* =====================================================
       IMAGE NAVIGATION
    ===================================================== */

    function nextImage() {

        const project =
            filteredProjects[currentProjectIndex];

        if (!project) return;


        currentImageIndex =
            (currentImageIndex + 1) %
            project.images.length;

        updateProjectImage();

    }



    function previousImage() {

        const project =
            filteredProjects[currentProjectIndex];

        if (!project) return;


        currentImageIndex =
            (
                currentImageIndex -
                1 +
                project.images.length
            ) %
            project.images.length;

        updateProjectImage();

    }



    /* =====================================================
       MAIN IMAGE BUTTON

       Клик по большой фотографии открывает lightbox.
    ===================================================== */

    if (projectImageButton) {

        projectImageButton.addEventListener(
            "click",
            () => {

                openLightbox();

            }
        );

    }



    /* =====================================================
       MAIN ARROWS
    ===================================================== */

    if (projectNext) {

        projectNext.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                nextProject();

            }
        );

    }


    if (projectPrev) {

        projectPrev.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                previousProject();

            }
        );

    }



    /* =====================================================
       FILTERS
    ===================================================== */

    filters.forEach(filter => {

        filter.addEventListener(
            "click",
            () => {

                const category =
                    filter.dataset.filter;


                filters.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                filter.classList.add("active");


                if (category === "all") {

                    filteredProjects =
                        [...projects];

                } else {

                    filteredProjects =
                        projects.filter(project =>
                            project.categories.includes(
                                category
                            )
                        );

                }


                currentProjectIndex = 0;

                currentImageIndex = 0;


                if (projectsVisibleCount) {

                    projectsVisibleCount.textContent =
                        padNumber(
                            filteredProjects.length
                        );

                }


                renderProject(true);

            }
        );

    });



    /* =====================================================
       LIGHTBOX ELEMENTS
    ===================================================== */

    const lightbox =
        document.getElementById(
            "projectLightbox"
        );

    const lightboxImage =
        document.getElementById(
            "lightboxImage"
        );

    const lightboxCurrent =
        document.getElementById(
            "lightboxCurrent"
        );

    const lightboxTotal =
        document.getElementById(
            "lightboxTotal"
        );

    const lightboxProjectName =
        document.getElementById(
            "lightboxProjectName"
        );

    const lightboxProjectYear =
        document.getElementById(
            "lightboxProjectYear"
        );

    const lightboxClose =
        document.getElementById(
            "projectLightboxClose"
        );

    const lightboxBackdrop =
        document.getElementById(
            "projectLightboxBackdrop"
        );

    const lightboxPrev =
        document.getElementById(
            "lightboxPrev"
        );

    const lightboxNext =
        document.getElementById(
            "lightboxNext"
        );

        const lightboxThumbnails =
    document.getElementById(
        "lightboxThumbnails"
    );



       // ============================================================
        // ЗАКРЫТИЕ ЛАЙТБОКСА ПО КЛИКУ / ТАПУ ВНЕ КОНТЕНТА
        // ============================================================

        lightbox.addEventListener("pointerdown", event => {

    const clickedInsideWindow =
        event.target.closest(".project-lightbox-window");

    if (!clickedInsideWindow) {
        closeLightbox();
    }

});



    /* =====================================================
       RENDER LIGHTBOX THUMBNAILS
    ===================================================== */

    function renderLightboxThumbnails(project) {

        if (!lightboxThumbnails) return;

        lightboxThumbnails.innerHTML = "";


        project.images.forEach(
            (image, index) => {

                const button =
                    document.createElement("button");

                button.type = "button";

                button.className =
                    "lightbox-thumbnail";


                if (
                    index === currentImageIndex
                ) {

                    button.classList.add(
                        "active"
                    );

                }


                button.setAttribute(
                    "aria-label",
                    `Открыть фотографию ${index + 1}`
                );


                const img =
                    document.createElement("img");

                img.src =
                    image;

                img.alt =
                    `${project.title} — фото ${index + 1}`;

                img.loading =
                    index === currentImageIndex
                        ? "eager"
                        : "lazy";

                img.decoding =
                    "async";


                button.appendChild(img);


                button.addEventListener(
                    "click",
                    () => {

                        currentImageIndex =
                            index;

                        updateLightbox();

                        updateProjectImage(
                            false
                        );

                    }
                );


                lightboxThumbnails.appendChild(
                    button
                );

            }
        );


    /* =================================================
       ПОКАЗЫВАЕМ АКТИВНУЮ МИНИАТЮРУ
    ================================================= */

    const activeThumbnail =
        lightboxThumbnails.querySelector(
            ".lightbox-thumbnail.active"
        );


    if (activeThumbnail) {

        activeThumbnail.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
        });

    }

}


    /* =====================================================
       UPDATE LIGHTBOX
    ===================================================== */

    function updateLightbox() {

        const project =
            filteredProjects[currentProjectIndex];

        if (!project) return;


        const image =
            project.images[currentImageIndex];


        lightboxImage.src =
            image;

        lightboxImage.alt =
            `${project.title} — фото ${currentImageIndex + 1}`;


        lightboxCurrent.textContent =
            padNumber(
                currentImageIndex + 1
            );

        lightboxTotal.textContent =
            padNumber(
                project.images.length
            );


        lightboxProjectName.textContent =
            project.title;

        lightboxProjectYear.textContent =
            project.year;


        /* ================================================
           LIGHTBOX THUMBNAILS
        ================================================ */

        renderLightboxThumbnails(
            project
        );

    }



    /* =====================================================
       OPEN LIGHTBOX
    ===================================================== */

    function openLightbox() {

        if (!lightbox) return;


        updateLightbox();


        lightbox.classList.add("active");

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    }



    /* =====================================================
       CLOSE LIGHTBOX
    ===================================================== */

    function closeLightbox() {

        if (!lightbox) return;


        lightbox.classList.remove(
            "active"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";

    }



    /* =====================================================
       LIGHTBOX IMAGE NAVIGATION
    ===================================================== */

    function lightboxNextImage() {

        nextImage();

        updateLightbox();

    }



    function lightboxPreviousImage() {

        previousImage();

        updateLightbox();

    }



    /* =====================================================
       LIGHTBOX EVENTS
    ===================================================== */

    if (lightboxClose) {

        lightboxClose.addEventListener(
            "click",
            closeLightbox
        );

    }


    if (lightboxNext) {

        lightboxNext.addEventListener(
            "click",
            lightboxNextImage
        );

    }


    if (lightboxPrev) {

        lightboxPrev.addEventListener(
            "click",
            lightboxPreviousImage
        );

    }



    /* =====================================================
       KEYBOARD
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                !lightbox ||
                !lightbox.classList.contains("active")
            ) {
                return;
            }


            if (event.key === "Escape") {

                closeLightbox();

            }


            if (
                event.key === "ArrowRight"
            ) {

                lightboxNextImage();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                lightboxPreviousImage();

            }

        }
    );


       /* =====================================================
           TOUCH GESTURES
        ===================================================== */

        let touchStartX = 0;
        let touchStartY = 0;

        const SWIPE_IMAGE_DISTANCE = 50;
        const SWIPE_CLOSE_DISTANCE = 100;

        const lightboxImageWrap =
            document.querySelector(".lightbox-image-wrap");

        if (lightboxImageWrap) {

            lightboxImageWrap.addEventListener(
                "touchstart",
                event => {

                    if (
                        !event.touches ||
                        event.touches.length !== 1
                    ) {
                        return;
                    }

                    const touch =
                        event.touches[0];

                    touchStartX =
                        touch.clientX;

                    touchStartY =
                        touch.clientY;

                },
                { passive: true }
            );


            lightboxImageWrap.addEventListener(
                "touchend",
                event => {

                    if (
                        !event.changedTouches ||
                        event.changedTouches.length !== 1
                    ) {
                        return;
                    }

                    const touch =
                        event.changedTouches[0];

                    const deltaX =
                        touch.clientX -
                        touchStartX;

                    const deltaY =
                        touch.clientY -
                        touchStartY;


                    /* ============================================
                       СВАЙП ВВЕРХ / ВНИЗ — ЗАКРЫТЬ
                    ============================================ */

                    if (
                        Math.abs(deltaY) >
                        SWIPE_CLOSE_DISTANCE &&
                        Math.abs(deltaY) >
                        Math.abs(deltaX)
                    ) {

                        closeLightbox();

                        return;

                    }


                    /* ============================================
                       СВАЙП ВЛЕВО / ВПРАВО — СМЕНА ФОТО
                    ============================================ */

                    if (
                        Math.abs(deltaX) <
                        SWIPE_IMAGE_DISTANCE ||
                        Math.abs(deltaX) <
                        Math.abs(deltaY)
                    ) {
                        return;
                    }


                    if (deltaX < 0) {

                        lightboxNextImage();

                    } else {

                        lightboxPreviousImage();

                    }

                },
                { passive: true }
            );

        }

        

    /* =====================================================
       PRELOAD NEXT IMAGE
    ===================================================== */

    function preloadNextImage() {

        const project =
            filteredProjects[currentProjectIndex];

        if (!project) return;


        const nextIndex =
            (
                currentImageIndex + 1
            ) %
            project.images.length;


        const image =
            new Image();

        image.src =
            project.images[nextIndex];

    }



    /* =====================================================
       PRELOAD AFTER IMAGE CHANGE
    ===================================================== */

    const originalUpdateProjectImage =
        updateProjectImage;


    /* =====================================================
       INITIAL RENDER
    ===================================================== */

    renderProject(false);


    if (projectsVisibleCount) {

        projectsVisibleCount.textContent =
            padNumber(
                filteredProjects.length
            );

    }

});





