```javascript
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve existing files during local development
if (process.env.NODE_ENV !== "production") {
    app.use(express.static(__dirname));
}

// Temporary in-memory data
let reports = [];
let contacts = [];

let reportId = 1;
let contactId = 1;

// REPORT APIs
app.post("/api/reports", (req, res) => {
    const { name, email, location, problemType, description, date } = req.body;

    if (!name || !email || !location || !problemType || !description || !date) {
        return res.status(400).json({
            success: false,
            message: "All report fields are required."
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address."
        });
    }

    const newReport = {
        id: reportId++,
        name, email, location, problemType, description, date
    };

    reports.push(newReport);

    res.status(201).json({
        success: true,
        message: "Problem report submitted successfully.",
        data: newReport
    });
});

app.get("/api/reports", (req, res) => {
    res.status(200).json({
        success: true,
        count: reports.length,
        data: reports
    });
});

app.get("/api/reports/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const report = reports.find(item => item.id === id);

    if (!report) {
        return res.status(404).json({
            success: false,
            message: "Report not found."
        });
    }

    res.status(200).json({ success: true, data: report });
});

app.put("/api/reports/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const reportIndex = reports.findIndex(item => item.id === id);

    if (reportIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Report not found."
        });
    }

    reports[reportIndex] = {
        ...reports[reportIndex],
        ...req.body,
        id
    };

    res.status(200).json({
        success: true,
        message: "Report updated successfully.",
        data: reports[reportIndex]
    });
});

app.delete("/api/reports/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const reportIndex = reports.findIndex(item => item.id === id);

    if (reportIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Report not found."
        });
    }

    const deletedReport = reports.splice(reportIndex, 1);

    res.status(200).json({
        success: true,
        message: "Report deleted successfully.",
        data: deletedReport[0]
    });
});

// CONTACT APIs
app.post("/api/contacts", (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "All contact fields are required."
        });
    }

    const newContact = { id: contactId++, name, email, message };
    contacts.push(newContact);

    res.status(201).json({
        success: true,
        message: "Your message has been submitted successfully.",
        data: newContact
    });
});

app.get("/api/contacts", (req, res) => {
    res.status(200).json({
        success: true,
        count: contacts.length,
        data: contacts
    });
});

app.put("/api/contacts/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const contactIndex = contacts.findIndex(item => item.id === id);

    if (contactIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Contact message not found."
        });
    }

    contacts[contactIndex] = {
        ...contacts[contactIndex],
        ...req.body,
        id
    };

    res.status(200).json({
        success: true,
        message: "Contact message updated successfully.",
        data: contacts[contactIndex]
    });
});

app.delete("/api/contacts/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const contactIndex = contacts.findIndex(item => item.id === id);

    if (contactIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Contact message not found."
        });
    }

    const deletedContact = contacts.splice(contactIndex, 1);

    res.status(200).json({
        success: true,
        message: "Contact message deleted successfully.",
        data: deletedContact[0]
    });
});

// SERVE WEBSITE
if (process.env.NODE_ENV === "production") {
    const clientPath = path.join(__dirname, "client", "dist");

    app.use(express.static(clientPath));

    // Serve original Contact page and its stylesheet
    app.get("/contact.html", (req, res) => {
        res.sendFile(path.join(__dirname, "contact.html"));
    });

    app.get("/style.css", (req, res) => {
        res.sendFile(path.join(__dirname, "style.css"));
    });

    // React fallback for other routes
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(clientPath, "index.html"));
    });
}

app.listen(PORT, () => {
    console.log("Smart & Sustainable City Server running on port " + PORT);
});
```
