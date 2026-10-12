// ==========================================
// REPORT FORM - FETCH API INTEGRATION
// ==========================================

const reportForm = document.querySelector("form");

if (reportForm) {

    reportForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // Get values from the existing Report form
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const location = document.getElementById("location").value.trim();
        const problemType = document.getElementById("problem").value;
        const description = document.getElementById("description").value.trim();
        const date = document.getElementById("date").value;

        // Check required fields
        if (
            !name ||
            !email ||
            !location ||
            !problemType ||
            !description ||
            !date
        ) {
            alert("Please fill in all fields.");
            return;
        }

        // Create data object
        const reportData = {
            name: name,
            email: email,
            location: location,
            problemType: problemType,
            description: description,
            date: date
        };

        try {

            // Send data to Node.js + Express backend
            const response = await fetch("/api/reports", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(reportData)
            });

            const result = await response.json();

            if (response.ok) {

                alert(result.message);

                // Clear form after successful submission
                reportForm.reset();

            } else {

                alert(result.message);
            }

        } catch (error) {

            console.error("Error:", error);

            alert("Unable to connect to the server.");
        }
    });
}