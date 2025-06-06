#!/usr/bin/env node

const express = require("express");
const db = require("./db");

const app = express();
const port = 80;

const { dbPath } = require("./db");
console.log("📦 Using database at:", dbPath);

function logger(req, res, next) {
  console.log(req.url);
  next();
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Get all shortlink
app.get("/", (req, res) => {
  try {
    const links = db.getAll();
    res.status(200).json(links);
  } catch (error) {
    console.log(error);
  }
});

// Create a shortlink
app.post("/", (req, res) => {
  const { alias, url } = req.body;
  if (!alias || !url)
    return res.status(400).json({ error: "alias and url required" });

  try {
    db.createLink(alias, url);
    res.status(201).json({ alias, url });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
      return res.status(409).json({ error: `Alias '${alias}' already exists` });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Redirect using alias
app.get("/:alias", (req, res) => {
  const alias = req.params.alias;
  const link = db.getLink(alias);

  if (!link) return res.status(404).send("Alias not found");

  let url = link.url;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "http://" + url;
  }

  res.redirect(302, url);
});

// Delete a shortlink
app.delete("/:alias", (req, res) => {
  const alias = req.params.alias;
  const result = db.deleteLink(alias);

  if (result.changes === 0)
    return res.status(404).json({ error: "Alias not found" });

  res.json({ message: `Deleted alias '${alias}'` });
});

app.listen(port, () => {
  console.log(`Shortr running on port ${port}`);
});
