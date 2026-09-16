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
                                    required
                                >

                            </div>

                        </div>

                        <div class="quiz-consents">

                            <label class="quiz-consent">

                                <input
                                    type="checkbox"
                                    name="personalConsent"
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

        const back =
            document.querySelector("#quizBack");

        if (back) {

            back.addEventListener("click", () => {

                if (currentStep <= 0) return;

                currentStep--;

                animateStepChange();
            });
        }

        const form =
            document.querySelector("#quizLeadForm");

        if (form) {

            form.addEventListener(
                "submit",
                handleSubmit
            );

            setupPhoneMask(
                form.querySelector('input[name="phone"]')
            );
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

    function setupPhoneMask(input) {

        if (!input) return;

        input.addEventListener(
            "input",
            event => {

                let value =
                    event.target.value
                        .replace(/\D/g, "");

                if (!value) {
                    event.target.value = "";
                    return;
                }

                if (value[0] === "8") {
                    value = "7" + value.slice(1);
                }

                if (value[0] !== "7") {
                    value = "7" + value;
                }

                value =
                    value.substring(0, 11);

                let result = "+7";

                if (value.length > 1) {
                    result +=
                        " (" +
                        value.substring(1, 4);
                }

                if (value.length >= 4) {
                    result += ")";
                }

                if (value.length > 4) {
                    result +=
                        " " +
                        value.substring(4, 7);
                }

                if (value.length > 7) {
                    result +=
                        "-" +
                        value.substring(7, 9);
                }

                if (value.length > 9) {
                    result +=
                        "-" +
                        value.substring(9, 11);
                }

                event.target.value = result;
            }
        );
    }

    /* ========================================================
       ICONS
       ======================================================== */

    function getContactIcon(icon) {

        switch (icon) {

            case "whatsapp":
                return "◌";

            case "telegram":
                return "➤";

            case "email":
                return "✉";

            default:
                return "•";
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