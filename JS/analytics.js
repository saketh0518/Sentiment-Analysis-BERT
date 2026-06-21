
// ==========================================
// GLOBAL CHART VARIABLES
// ==========================================

let pieChart = null;
let barChart = null;


// ==========================================
// PAGE LOAD
// ==========================================

window.onload = function () {

    loadAnalytics();

};


// ==========================================
// LOAD ANALYTICS
// ==========================================

function loadAnalytics() {

    let history = JSON.parse(

        localStorage.getItem(
            "sentimentHistory"
        )

    ) || [];

    let positive = 0;
    let negative = 0;
    let neutral = 0;

    history.forEach(item => {

        if (
            item.sentiment.includes(
                "Positive"
            )
        ) {

            positive++;

        }

        else if (

            item.sentiment.includes(
                "Negative"
            )

        ) {

            negative++;

        }

        else if (

            item.sentiment.includes(
                "Neutral"
            )

        ) {

            neutral++;

        }

    });

    updateCards(

        history.length,

        positive,

        negative,

        neutral

    );

    drawPieChart(

        positive,

        negative,

        neutral

    );

    drawBarChart(

        positive,

        negative,

        neutral

    );

    loadRecentActivity(
        history
    );

    loadWordFrequency(
        history
    );

}


// ==========================================
// UPDATE CARDS
// ==========================================

function updateCards(

    total,

    positive,

    negative,

    neutral

) {

    document.getElementById(
        "total-analysis"
    ).innerText = total;

    document.getElementById(
        "positive-count"
    ).innerText = positive;

    document.getElementById(
        "negative-count"
    ).innerText = negative;

    document.getElementById(
        "neutral-count"
    ).innerText = neutral;

}


// ==========================================
// DOUGHNUT CHART
// ==========================================

function drawPieChart(

    positive,

    negative,

    neutral

) {

    const ctx =
        document.getElementById(
            "pie-chart"
        );

    if (!ctx) return;

    if (pieChart) {

        pieChart.destroy();

    }

    pieChart = new Chart(

        ctx,

        {

            type: "doughnut",

            data: {

                labels: [

                    "Positive",

                    "Negative",

                    "Neutral"

                ],

                datasets: [

                    {

                        data: [

                            positive,

                            negative,

                            neutral

                        ],

                        backgroundColor: [

                            "#22C55E",

                            "#EF4444",

                            "#FACC15"

                        ],

                        borderColor:
                            "#0F1B34",

                        borderWidth: 3,

                        hoverOffset: 8

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "55%",

                plugins: {

                    legend: {

                        position: "top",

                        labels: {

                            color:
                                "#FFFFFF",

                            usePointStyle:
                                true,

                            pointStyle:
                                "circle",

                            boxWidth: 12,

                            padding: 20,

                            font: {

                                family:
                                    "Arial",

                                size: 13,

                                weight:
                                    "normal"

                            }

                        }

                    }

                }

            }

        }

    );

}


// ==========================================
// BAR CHART
// ==========================================

function drawBarChart(

    positive,

    negative,

    neutral

) {

    const ctx =
        document.getElementById(
            "bar-chart"
        );

    if (!ctx) return;

    if (barChart) {

        barChart.destroy();

    }

    barChart = new Chart(

        ctx,

        {

            type: "bar",

            data: {

                labels: [

                    "Positive",

                    "Negative",

                    "Neutral"

                ],

                datasets: [

                    {

                        data: [

                            positive,

                            negative,

                            neutral

                        ],

                        backgroundColor: [

                            "#22C55E",

                            "#EF4444",

                            "#FACC15"

                        ],

                        borderRadius: 8,

                        borderSkipped:
                            false,

                        barThickness: 40,

                        maxBarThickness:
                            45

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio:
                    false,

                plugins: {

                    legend: {

                        display: false

                    }

                },

                scales: {

                    x: {

                        grid: {

                            display:
                                false

                        },

                        ticks: {

                            color:
                                "#FFFFFF",

                            font: {

                                family:
                                    "Arial",

                                size: 12

                            }

                        }

                    },

                    y: {

                        beginAtZero:
                            true,

                        ticks: {

                            color:
                                "#FFFFFF",

                            stepSize: 1,

                            font: {

                                family:
                                    "Arial",

                                size: 11

                            }

                        },

                        grid: {

                            color:
                            "rgba(255,255,255,0.08)"

                        }

                    }

                }

            }

        }

    );

}


// ==========================================
// RECENT ACTIVITY
// ==========================================

function loadRecentActivity(
    history
) {

    const list =
        document.getElementById(
            "recent-activity-list"
        );

    if (!list) return;

    list.innerHTML = "";

    let latest =
        history
        .slice(-5)
        .reverse();

    latest.forEach(item => {

        list.innerHTML += `

        <li>

        ${item.sentiment}

        analysis completed

        (${item.date})

        </li>

        `;

    });

}


// ==========================================
// WORD FREQUENCY
// ==========================================

function loadWordFrequency(
    history
) {

    const container =
        document.querySelector(
            ".word-container"
        );

    if (!container) return;

    container.innerHTML = "";

    let words = {};

    history.forEach(item => {

        item.text

            .toLowerCase()

            .split(" ")

            .forEach(word => {

                word = word.replace(
                    /[^a-z]/g,
                    ""
                );

                if (
                    word.length > 3
                ) {

                    words[word] =

                        (words[word] || 0)

                        + 1;

                }

            });

    });

    let sortedWords =

        Object.entries(words)

        .sort(

            (a, b) =>

            b[1] - a[1]

        )

        .slice(0, 8);

    sortedWords.forEach(item => {

        container.innerHTML += `

        <span class="word-tag">

        ${item[0]}

        </span>

        `;

    });

}
