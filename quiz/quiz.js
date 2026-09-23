
/* ============================================================
   LIGHT / HOME — QUIZ
   ============================================================ */

document.addEventListener("DOMContentLoaded", async () => {

    const quizRoot = document.querySelector("#lightQuiz");

    if (!quizRoot) return;

    const QUIZ_JSON = "./quiz/quiz.json";

    let config;

    try {
        const response = await fetch(QUIZ_JSON);

        if (!response.ok) {
            throw new Error("Не удалось загрузить quiz.json");
        }

        config = await response.json();

    } catch (error) {

        console.error("Quiz config error:", error);

        quizRoot.innerHTML = `
            <div style="
                padding:60px 20px;
                text-align:center;
                color:#fff;
            ">
                Не удалось загрузить квиз.
            </div>
        `;

        return;
    }

    const steps = config.steps || [];
    const lead = config.lead || {};
    const settings = config.settings || {};

    let currentStep = 0;

    const answers = {};

    /* ========================================================
       LEAD DATA
       ======================================================== */

    let leadData = {
        name: "",
        phone: "",
        personalConsent: false,
        marketingConsent: false
    };

    /* ========================================================
       RENDER
       ======================================================== */

    renderQuiz();

    function renderQuiz() {

        quizRoot.innerHTML = `
            <div class="quiz-container">

                <div class="quiz-intro">

                    <div>
                        <div class="quiz-kicker">
                            Индивидуальная визуализация
                        </div>

                        <h2 class="quiz-title">
                            ${escapeHTML(settings.title || "Подберём свет для вашего дома")}
                        </h2>
                    </div>

                    <p class="quiz-intro-text">
                        ${escapeHTML(
                            settings.subtitle ||
                            "Ответьте на несколько вопросов — и мы подготовим направление будущей подсветки."
                        )}
                    </p>

                </div>

                <div class="quiz-window">

                    <div class="quiz-header">

                        <div class="quiz-step-label">
                            ШАГ
                            <strong id="quizCurrentStep">01</strong>
                            /
                            <span id="quizTotalSteps">
                                ${String(steps.length + 1).padStart(2, "0")}
                            </span>
                        </div>

                        <div class="quiz-progress">
                            <div
                                class="quiz-progress-bar"
                                id="quizProgressBar"
                            ></div>
                        </div>

                    </div>

                    <div class="quiz-content" id="quizContent"></div>

                </div>

            </div>
        `;

        renderStep();
    }

    /* ========================================================
       RENDER STEP
       ======================================================== */

    function renderStep() {

        const content = document.querySelector("#quizContent");

        if (!content) return;

        if (currentStep < steps.length) {

            const step = steps[currentStep];

            content.innerHTML = createQuestionStep(step);

        } else {

            content.innerHTML = createLeadStep();

        }

        updateProgress();
        bindStepEvents();
    }

    /* ========================================================
       QUESTION
       ======================================================== */

    function createQuestionStep(step) {

        const options = step.options || [];

        let optionsHTML = "";

        if (step.type === "contact-method") {

            optionsHTML = `
                <div class="quiz-contact-options">
                    ${options.map(option => `
                        <button
                            type="button"
                            class="quiz-contact-option ${
                                answers[step.id] === option.id
                                    ? "selected"
                                    : ""
                            }"
                            data-option="${escapeHTML(option.id)}"
                        >

                            <span class="quiz-contact-icon">
                                ${getContactIcon(option.icon)}
                            </span>

                            <span class="quiz-contact-title">
                                ${escapeHTML(option.title)}
                            </span>

                        </button>
                    `).join("")}
                </div>
            `;

        } else {

            let gridClass = "";

            if (options.length === 2) {
                gridClass = "two";
            }

            if (options.length === 3) {
                gridClass = "three";
            }

            optionsHTML = `
                <div class="quiz-options ${gridClass}">

                    ${options.map(option => {

                        const selected =
                            answers[step.id] === option.id;

                        return `
                            <button
                                type="button"
                                class="quiz-option ${
                                    selected ? "selected" : ""
                                }"
                                data-option="${escapeHTML(option.id)}"
                            >

                                ${
                                    option.image
                                    ? `
                                        <div
                                            class="quiz-option-image"
                                            style="
                                                background-image:
                                                url('${escapeAttribute(option.image)}')
                                            "
                                        ></div>
                                    `
                                    : ""
                                }

                                <span class="quiz-option-check">
                                    ✓
                                </span>

                                <span class="quiz-option-content">

                                    <span class="quiz-option-title">
                                        ${escapeHTML(option.title)}
                                    </span>

                                    ${
                                        option.description
                                        ? `
                                            <span class="quiz-option-description">
                                                ${escapeHTML(option.description)}
                                            </span>
                                        `
                                        : ""
                                    }

                                </span>

                            </button>
                        `;

                    }).join("")}

                </div>
            `;
        }

        return `
            <div class="quiz-step active">

                <div class="quiz-question-top">

                    <div class="quiz-number">
                        ${escapeHTML(step.number || String(currentStep + 1).padStart(2, "0"))}
                    </div>

                    <h3 class="quiz-question">
                        ${escapeHTML(step.question)}
                    </h3>

                    ${
                        step.description
                        ? `
                            <p class="quiz-description">
                                ${escapeHTML(step.description)}
                            </p>
                        `
                        : ""
                    }

                </div>

                ${optionsHTML}

                <div class="quiz-navigation">

                    <button
                        type="button"
                        class="quiz-back"
                        id="quizBack"
                        ${currentStep === 0 ? "style='visibility:hidden'" : ""}
                    >
                        <span class="quiz-back-arrow">←</span>
                        Назад
                    </button>

                    <button
                        type="button"
                        class="quiz-next"
                        id="quizNext"
                    >
                        Далее
                        <span class="quiz-next-arrow">→</span>
                    </button>

                </div>

                <div
                    class="quiz-error"
                    id="quizStepError"
                >
                    Пожалуйста, выберите вариант.
                </div>

            </div>
        `;
    }

    /* ========================================================
       LEAD
       ======================================================== */

    function createLeadStep() {

        return `
            <div class="quiz-step active">

                <div class="quiz-lead">

                    <div class="quiz-number">
                        05
                    </div>

                    <h3 class="quiz-lead-title">
                        ${escapeHTML(
                            lead.title ||
                            "Уже начинаем готовить визуализацию 🔥"
                        )}
                    </h3>

                    <p class="quiz-lead-subtitle">
                        ${escapeHTML(
                            lead.subtitle ||
                            "Остался последний этап — оставьте контакты."
                        )}
                    </p>

                    <form id="quizLeadForm">

                        <div class="quiz-form-grid">

                            <div class="quiz-field">
                                <input
                                    type="text"
                                    name="name"
                                    autocomplete="name"
                                    placeholder="${escapeAttribute(
                                        lead.namePlaceholder || "Ваше имя"
                                    )}"
                                    value="${escapeAttribute(leadData.name)}"
                                >
                            </div>

                            <div class="quiz-field">

                                <input
                                    type="tel"
                                    name="phone"
                                    autocomplete="tel"
                                    inputmode="tel"
                                    placeholder="${escapeAttribute(
                                        lead.phonePlaceholder ||
                                        "+7 (___) ___-__-__"
                                    )}"
                                    value="${escapeAttribute(leadData.phone)}"
                                    required
                                >

                            </div>

                        </div>

                        <div class="quiz-consents">

                            <label class="quiz-consent">

                                <input
                                    type="checkbox"
                                    name="personalConsent"
                                    ${leadData.personalConsent ? "checked" : ""}
                                    required
                                >

                                <span>
                                    ${escapeHTML(
                                        lead.personalConsent ||
                                        "Я даю согласие на обработку моих персональных данных"
                                    )}
                                </span>

                            </label>

                            <label class="quiz-consent">

                                <input
                                    type="checkbox"
                                    name="marketingConsent"
                                    ${leadData.marketingConsent ? "checked" : ""}
                                >

                                <span>
                                    ${escapeHTML(
                                        lead.marketingConsent ||
                                        "Я согласен(а) на получение информационной и рекламной рассылки"
                                    )}
                                </span>

                            </label>

                        </div>

                        <div
                            class="quiz-error"
                            id="quizFormError"
                        >
                        </div>

                        <div class="quiz-navigation quiz-lead-navigation">

                            <button
                                type="submit"
                                class="quiz-submit"
                            >
                                ${escapeHTML(
                                    lead.button ||
                                    "Получить визуализацию"
                                )}

                                <span>→</span>
                            </button>

                        </div>

                    </form>

                </div>

            </div>
        `;
    }

    /* ========================================================
       EVENTS
       ======================================================== */

    function bindStepEvents() {

        const content = document.querySelector("#quizContent");

        if (!content) return;

        const optionButtons =
            content.querySelectorAll(
                "[data-option]"
            );

        optionButtons.forEach(button => {

            button.addEventListener("click", () => {

                const step = steps[currentStep];

                answers[step.id] =
                    button.dataset.option;

                optionButtons.forEach(item => {
                    item.classList.remove("selected");
                });

                button.classList.add("selected");

                const error =
                    document.querySelector("#quizStepError");

                if (error) {
                    error.classList.remove("visible");
                }
            });

        });

        const next =
            document.querySelector("#quizNext");

        if (next) {

            next.addEventListener("click", () => {

                const step = steps[currentStep];

                if (!answers[step.id]) {

                    const error =
                        document.querySelector("#quizStepError");

                    if (error) {
                        error.classList.add("visible");
                    }

                    return;
                }

                currentStep++;

                animateStepChange();
            });
        }


        const form = document.querySelector("#quizLeadForm");

if (form) {
    form.addEventListener("submit", handleSubmit);

    const phoneInput = form.querySelector('input[name="phone"]');

    if (phoneInput && typeof $ !== "undefined") {
        $(phoneInput).mask("+7 (999) 999-99-99");
    }
}

        /* ====================================================
           BACK BUTTON
           ==================================================== */

        const back =
            document.querySelector("#quizBack");

        if (back) {

            back.addEventListener("click", () => {

                /*
                 * Если мы на шаге контактов,
                 * сначала сохраняем введённые данные.
                 */

                if (currentStep === steps.length) {

                    const form =
                        document.querySelector("#quizLeadForm");

                    if (form) {

                        leadData.name =
                            form.elements.name.value.trim();

                        leadData.phone =
                            form.elements.phone.value.trim();

                        leadData.personalConsent =
                            form.elements.personalConsent.checked;

                        leadData.marketingConsent =
                            form.elements.marketingConsent.checked;
                    }
                }

                if (currentStep <= 0) return;

                currentStep--;

                animateStepChange();
            });
        }

      
    }

    /* ========================================================
       STEP ANIMATION
       ======================================================== */

    function animateStepChange() {

        const content =
            document.querySelector("#quizContent");

        if (!content) return;

        content.style.opacity = "0";
        content.style.transform = "translateY(12px)";

        setTimeout(() => {

            renderStep();

            requestAnimationFrame(() => {

                content.style.transition =
                    "opacity .45s ease, transform .45s cubic-bezier(.22,1,.36,1)";

                content.style.opacity = "1";
                content.style.transform = "translateY(0)";

            });

        }, 180);
    }

    /* ========================================================
       PROGRESS
       ======================================================== */

    function updateProgress() {

        const current =
            document.querySelector("#quizCurrentStep");

        const progress =
            document.querySelector("#quizProgressBar");

        const total = steps.length + 1;

        const number =
            Math.min(currentStep + 1, total);

        if (current) {
            current.textContent =
                String(number).padStart(2, "0");
        }

        if (progress) {

            progress.style.width =
                `${(number / total) * 100}%`;
        }
    }

    /* ========================================================
       SUBMIT
       ======================================================== */

    async function handleSubmit(event) {

        event.preventDefault();

        const form = event.currentTarget;

        const name =
            form.elements.name.value.trim();

        const phone =
            form.elements.phone.value.trim();

        const personalConsent =
            form.elements.personalConsent.checked;

        const marketingConsent =
            form.elements.marketingConsent.checked;

        const error =
            document.querySelector("#quizFormError");

        if (!phone || !personalConsent) {

            if (error) {

                error.textContent =
                    "Укажите телефон и подтвердите согласие.";

                error.classList.add("visible");
            }

            return;
        }

        /*
         * Сохраняем актуальные данные перед отправкой.
         */

        leadData.name = name;
        leadData.phone = phone;
        leadData.personalConsent = personalConsent;
        leadData.marketingConsent = marketingConsent;

        const submitButton =
            form.querySelector(".quiz-submit");

        submitButton.disabled = true;

        submitButton.innerHTML =
            "Отправляем...";

        const payload = {

            type: "quiz",

            timestamp:
                new Date().toISOString(),

            name,

            phone,

            personalConsent,

            marketingConsent,

            answers: {
                style: getAnswerTitle("style"),
                lighting: getAnswerTitle("lighting"),
                decorations: getAnswerTitle("decorations"),
                contactMethod: getAnswerTitle("contact-method")
            },

            rawAnswers: {
                style: answers.style || null,
                lighting: answers.lighting || null,
                decorations: answers.decorations || null,
                contactMethod: answers["contact-method"] || null
            },

            source:
                window.location.href
        };

        try {

            if (!settings.googleScriptUrl) {

                console.warn(
                    "Google Apps Script URL ещё не указан.",
                    payload
                );

                showSuccess();

                return;
            }

            await fetch(
                settings.googleScriptUrl,
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

            showSuccess();

        } catch (submitError) {

            console.error(
                "Quiz submit error:",
                submitError
            );

            if (error) {

                error.textContent =
                    "Не удалось отправить заявку. Попробуйте ещё раз.";

                error.classList.add("visible");
            }

            submitButton.disabled = false;

            submitButton.innerHTML =
                `${escapeHTML(
                    lead.button ||
                    "Получить визуализацию"
                )} <span>→</span>`;
        }
    }

    /* ========================================================
       SUCCESS
       ======================================================== */

    function showSuccess() {

        const content =
            document.querySelector("#quizContent");

        if (!content) return;

        content.innerHTML = `

            <div class="quiz-success active">

                <div>

                    <div class="quiz-success-light">
                        ✓
                    </div>

                    <h3 class="quiz-success-title">
                        ${escapeHTML(
                            settings.successTitle ||
                            "Заявка отправлена"
                        )}
                    </h3>

                    <p class="quiz-success-text">
                        ${escapeHTML(
                            settings.successText ||
                            "Спасибо. Мы получили ваши ответы и скоро свяжемся с вами."
                        )}
                    </p>

                </div>

            </div>
        `;

        currentStep = steps.length;

        updateProgress();
    }

    /* ========================================================
       ANSWER TITLE
       ======================================================== */

    function getAnswerTitle(stepId) {

        const value = answers[stepId];

        if (!value) return "";

        const step =
            steps.find(item => item.id === stepId);

        if (!step) return value;

        const option =
            step.options.find(
                item => item.id === value
            );

        return option
            ? option.title +
              (
                  option.description
                      ? ` — ${option.description}`
                      : ""
              )
            : value;
    }

    /* ========================================================
       PHONE MASK
       ======================================================== */


    /* ========================================================
       ICONS
       ======================================================== */

    function getContactIcon(icon) {

    switch (icon) {

        case "whatsapp":
            return `
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        d="M20.52 3.48A11.82 11.82 0 0 0 12.05 0
                        C5.52 0 .2 5.31.2 11.84c0 2.09.55 4.13 1.6 5.92L.1 24
                        l6.38-1.67a11.84 11.84 0 0 0 5.57 1.4h.01
                        c6.53 0 11.84-5.31 11.84-11.84
                        0-3.16-1.23-6.13-3.38-8.41ZM12.06 21.75
                        a9.84 9.84 0 0 1-5.02-1.38l-.36-.21-3.79.99
                        1.01-3.7-.23-.38a9.82 9.82 0 0 1-1.5-5.23
                        c0-5.43 4.42-9.84 9.85-9.84
                        2.63 0 5.1 1.03 6.96 2.89
                        a9.78 9.78 0 0 1 2.89 6.96
                        c-.01 5.43-4.43 9.84-9.81 9.9Z"
                    />

                    <path
                        d="M17.45 14.45c-.3-.15-1.76-.87-2.03-.97
                        -.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17
                        -.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49
                        -.9-.8-1.5-1.79-1.67-2.09-.17-.3-.02-.46.13-.61
                        .13-.13.3-.35.45-.52.15-.17.2-.3.3-.5
                        .1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22
                        -.24-.58-.49-.5-.67-.51h-.57
                        c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49
                        0 1.47 1.07 2.89 1.22 3.09
                        .15.2 2.1 3.21 5.09 4.5
                        .71.31 1.27.5 1.7.64
                        .72.23 1.38.2 1.9.12
                        .58-.09 1.76-.72 2.01-1.42
                        .25-.7.25-1.3.17-1.42
                        -.07-.12-.27-.2-.57-.35Z"
                    />
                </svg>
            `;


        case "telegram":
            return `
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        d="M21.9 2.3 2.8 9.67c-1.3.51-1.29 1.22-.24 1.53l4.9 1.53
                        1.88 5.84c.23.65.12.91.79.91.52 0 .75-.24 1.03-.52
                        l2.38-2.31 4.95 3.65c.91.5 1.57.24 1.8-.84
                        l3.25-15.3c.34-1.33-.51-1.93-1.64-1.46ZM17.4 18.18
                        9.84 12.27l9.31-5.86c.41-.25.79-.11.48.16
                        l-7.54 6.8-.29 4.81 1.01-3.98 4.59 3.98Z"
                    />
                </svg>
            `;


        case "email":
            return `
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                >
                    <rect
                        x="2.5"
                        y="4.5"
                        width="19"
                        height="15"
                        rx="2"
                    />

                    <path
                        d="M3.5 6 12 12.5 20.5 6"
                    />
                </svg>
            `;


        default:
            return `
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="8"
                    />
                </svg>
            `;
    }
}

    /* ========================================================
       SECURITY / HTML HELPERS
       ======================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function escapeAttribute(value) {

        return String(value ?? "")
            .replace(/'/g, "%27")
            .replace(/"/g, "%22");
    }

});