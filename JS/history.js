// ==========================================
// LOAD HISTORY
// ==========================================

window.onload = function () {

    loadHistory();

};


// ==========================================
// LOAD HISTORY TABLE
// ==========================================

function loadHistory() {

    const tableBody =
        document.getElementById(
            "history-table-body"
        );

    if (!tableBody) return;

    tableBody.innerHTML = "";

    let history =
        JSON.parse(
            localStorage.getItem(
                "sentimentHistory"
            )
        ) || [];

    if (history.length === 0) {

        tableBody.innerHTML = `

        <tr>

            <td colspan="6"
                style="text-align:center;">

                No history available.

            </td>

        </tr>

        `;

        return;

    }

    history.forEach((item, index) => {

        let badgeClass = "";

        if (item.sentiment === "Positive") {

            badgeClass = "positive-tag";

        }

        else if (item.sentiment === "Negative") {

            badgeClass = "negative-tag";

        }

        else {

            badgeClass = "neutral-tag";

        }

        tableBody.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>${item.text}</td>

            <td>

                <span class="${badgeClass}">

                    ${item.sentiment}

                </span>

            </td>

            <td>${item.confidence}%</td>

            <td>${item.date}</td>

            <td>

                <button
                    class="delete-button"
                    onclick="deleteRecord(${index})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}


// ==========================================
// DELETE ONE RECORD
// ==========================================

function deleteRecord(index) {

    let history =
        JSON.parse(
            localStorage.getItem(
                "sentimentHistory"
            )
        ) || [];

    history.splice(index, 1);

    localStorage.setItem(

        "sentimentHistory",

        JSON.stringify(history)

    );

    loadHistory();

}


// ==========================================
// CLEAR ALL HISTORY
// ==========================================

function clearHistory() {

    const confirmDelete =
        confirm(
            "Clear all history?"
        );

    if (!confirmDelete) return;

    localStorage.removeItem(
        "sentimentHistory"
    );

    loadHistory();

}


// ==========================================
// EXPORT CSV
// ==========================================

function exportCSV() {

    let history =
        JSON.parse(
            localStorage.getItem(
                "sentimentHistory"
            )
        ) || [];

    if (history.length === 0) {

        alert(
            "No history available."
        );

        return;

    }

    let csv =

        "Text,Sentiment,Confidence,Date\n";

    history.forEach(item => {

        csv +=

        `"${item.text}",` +

        `"${item.sentiment}",` +

        `"${item.confidence}%",` +

        `"${item.date}"\n`;

    });

    let blob =

        new Blob(

            [csv],

            {
                type: "text/csv"
            }

        );

    let url =
        URL.createObjectURL(blob);

    let a =
        document.createElement("a");

    a.href = url;

    a.download =
        "BERT_Sentiment_History.csv";

    a.click();

    URL.revokeObjectURL(url);

}


// ==========================================
// SEARCH HISTORY
// ==========================================

function searchHistory() {

    const searchText =

        document
        .getElementById(
            "search-input"
        )
        .value
        .toLowerCase();

    const rows =

        document
        .querySelectorAll(
            "#history-table-body tr"
        );

    rows.forEach(row => {

        if (

            row.innerText
            .toLowerCase()
            .includes(searchText)

        ) {

            row.style.display = "";

        }

        else {

            row.style.display =
                "none";

        }

    });

}


// ==========================================
// SENTIMENT FILTER
// ==========================================

function filterHistory() {

    const selected =

        document
        .getElementById(
            "sentiment-filter"
        )
        .value;

    const rows =

        document
        .querySelectorAll(
            "#history-table-body tr"
        );

    rows.forEach(row => {

        if (

            selected ===
            "All Sentiments"

        ) {

            row.style.display = "";

        }

        else if (

            row.innerText
            .includes(selected)

        ) {

            row.style.display = "";

        }

        else {

            row.style.display =
                "none";

        }

    });

}


// ==========================================
// EVENT LISTENERS
// ==========================================

document.addEventListener(

    "DOMContentLoaded",

    function () {

        const searchBox =
            document.getElementById(
                "search-input"
            );

        if (searchBox) {

            searchBox.addEventListener(
                "keyup",
                searchHistory
            );

        }

        const filter =
            document.getElementById(
                "sentiment-filter"
            );

        if (filter) {

            filter.addEventListener(
                "change",
                filterHistory
            );

        }

        const exportBtn =
            document.getElementById(
                "export-csv-button"
            );

        if (exportBtn) {

            exportBtn.addEventListener(
                "click",
                exportCSV
            );

        }

        const clearBtn =
            document.getElementById(
                "clear-history-button"
            );

        if (clearBtn) {

            clearBtn.addEventListener(
                "click",
                clearHistory
            );

        }

    }

);