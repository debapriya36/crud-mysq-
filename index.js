const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { pool } = require("./db.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Limiting the number of requests from an IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(apiLimiter);

// Database connection
(async function init() {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("Connected to the database", rows);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

// CRUD
app.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM new_table");
  if (!rows) {
    return res.status(400).json({ message: "No data found" });
  }
  res
    .status(200)
    .json({ success: true, message: "Data fetched successfully", data: rows });
});

app.get("/:id", async (req, res) => {
  let id = req.params.id;
  if(!id){ return res.status(400).json({ message: "Please provide an id" }); }
  const [data] = await pool.query("SELECT * FROM new_table WHERE idnew_table = ?",[id]);
  if (!data || data.length === 0) {
    return res.status(400).json({ message: "No data found" });
  }
  return res.status(200).json({ success: true, message: "Data fetched with id successfully", data});
});

app.post("/",async (req,res) => {
    if(!req.body.idnew_table){ return res.status(400).json({ message: "Please provide an id" }); }

    const [data] = await pool.query("INSERT INTO new_table SET ?",[req.body]);
    if (!data) {
      return res.status(400).json({ message: "Data not inserted" });
    }
    return res.status(200).json({ success: true, message: "Data inserted successfully", data});
});

app.put("/",async(req,res)=>{
    if(!req.body.idnew_table_old){ return res.status(400).json({ message: "Please provide an id" }); }
   const [rows] = await pool.query("UPDATE new_table SET idnew_table = ? WHERE idnew_table = ?",[req.body.idnew_table,req.body.idnew_table_old])
    if (!rows) {
      return res.status(400).json({ message: "Data not updated" });
    }
    return res.status(200).json({ success: true, message: "Data updated successfully", data: rows});
});

app.delete("/:id",async(req,res)=>{
    let id = req.params.id;
    if(!id){ return res.status(400).json({ message: "Please provide an id" }); }
    const [rows] = await pool.query("DELETE FROM new_table WHERE idnew_table = ?",[id])
    if (!rows) {
      return res.status(400).json({ message: "Data not deleted" });
    }
    return res.status(200).json({ success: true, message: "Data deleted successfully", data: rows});
});

app.use((err, _req, res, _next) => {
  console.error("Error:->", err.message);
  res.status(500).json({
    success: false,
    message: "Something went wrong" || err.message,
  });
});

app.listen(PORT, () => console.log("Backend is fucking ready", PORT));
