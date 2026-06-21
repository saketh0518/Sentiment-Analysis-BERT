// ==========================================
// API URL
// ==========================================

const API_URL = "http://127.0.0.1:8000/predict";


// ==========================================
// ANALYZE SENTIMENT
// ==========================================

async function analyzeSentiment() {

    const inputBox =
        document.getElementById("sentiment-input");

    const text =
        inputBox.value.trim();

    if (text === "") {

        alert("Please enter some text.");

        return;

    }

    try {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    text: text
                })

            });

        const data =
            await response.json();

        displayResult(data);

        saveHistory(text, data);

    }

    catch (error) {

        console.log(error);

        alert("Server connection failed.");

    }

}


// ==========================================
// DISPLAY RESULT
// ==========================================

function displayResult(data) {

    document.getElementById(
        "sentiment-label"
    ).innerText =
        data.sentiment;

    document.getElementById(
        "confidence-value"
    ).innerText =
        data.confidence + "%";


    // ==========================
    // Positive Bar
    // ==========================

    document.getElementById(
        "positive-fill"
    ).style.width =
        data.positive + "%";

    document.getElementById(
        "positive-fill"
    ).style.background =
        "#22C55E";

    document.getElementById(
        "positive-score"
    ).innerText =
        data.positive + "%";


    // ==========================
    // Negative Bar
    // ==========================

    document.getElementById(
        "negative-fill"
    ).style.width =
        data.negative + "%";

    document.getElementById(
        "negative-fill"
    ).style.background =
        "#EF4444";

    document.getElementById(
        "negative-score"
    ).innerText =
        data.negative + "%";


    // ==========================
    // Neutral Bar
    // ==========================

    document.getElementById(
        "neutral-fill"
    ).style.width =
        data.neutral + "%";

    document.getElementById(
        "neutral-fill"
    ).style.background =
        "#FACC15";

    document.getElementById(
        "neutral-score"
    ).innerText =
        data.neutral + "%";


    // ==========================
    // AI Explanation
    // ==========================

    document.getElementById(
        "explanation-text"
    ).innerText =
        data.explanation;

}



// ==========================================
// SAVE HISTORY
// ==========================================

function saveHistory(text, data) {

    let history =
        JSON.parse(
            localStorage.getItem(
                "sentimentHistory"
            )
        ) || [];

    history.push({

        text: text,

        sentiment:
            data.sentiment,

        confidence:
            data.confidence,

        positive:
            data.positive,

        negative:
            data.negative,

        neutral:
            data.neutral,

        explanation:
            data.explanation,

        date:
            new Date()
            .toLocaleString()

    });

    localStorage.setItem(

        "sentimentHistory",

        JSON.stringify(history)

    );

}


// ==========================================
// CHARACTER COUNTER
// ==========================================

const inputField =
    document.getElementById(
        "sentiment-input"
    );

if (inputField) {

    inputField.addEventListener(

        "input",

        function () {

            const count =
                this.value.length;

            document.getElementById(
                "character-counter"
            ).innerText =
                count + " / 1000";

        }

    );

}


// ==========================================
// EXAMPLE BUTTONS
// ==========================================

function loadPositiveExample() {

    document.getElementById(
        "sentiment-input"
    ).value =
        "This movie was absolutely amazing and inspiring.";

}

function loadNegativeExample() {

    document.getElementById(
        "sentiment-input"
    ).value =
        "The service was terrible and very disappointing.";

}

function loadNeutralExample() {

    document.getElementById(
        "sentiment-input"
    ).value =
        "I watched the movie yesterday with my friends.";

}
