const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {google} = require("googleapis");
const credentials = require ("./credentials.json");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


// Google Sheets setup
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SHEET_ID = "1qpqgNYnedX3KSxf9-hlV8sxE6y8unXQ427zX3wMW5Q8";
const sheets = google.sheets({version:"v4", auth});

app.post("/contact", async (req, res)=> {
    try {
        const {name, email, message} = req.body;
        const now = new Date().toLocaleString();
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: "Sheet1|A:D",
            valueInputOption: "RAW",
            requestBody: {
                values: [[now, name, email, message]],
            },
        });

        res.status(200).send({success: true, message: "Data added to sheet"});
    } catch (error) {
        console.error("Error adding data to sheet:", error);
        res.status(500).send({success: false, message: "Error adding data"});
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});