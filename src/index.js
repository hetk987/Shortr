#!/usr/bin/env node

const express = require("express");
const prisma = require("../prismaClient");
const app = express();
const port = 80;

console.log("🧩 Using Prisma client");

function logger(req, res, next) {
  console.log(req.method, req.url);
  next();
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Get all shortlinks
app.get("/", async (req, res) => {
  try {
    const links = await prisma.shortLink.findMany();
    res.status(200).json(links);
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a shortlink
app.post("/", async (req, res) => {
  const { alias, url } = req.body;
  if (!alias || !url)
    return res.status(400).json({ error: "alias and url required" });

  try {
    const newLink = await prisma.shortLink.create({
      data: { alias, url },
    });
    res.status(201).json(newLink);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: `Alias '${alias}' already exists` });
    }
    console.error("Error creating shortlink:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Redirect using alias
app.get("/:alias", async (req, res) => {
  const alias = req.params.alias;
  try {
    const link = await prisma.shortLink.findUnique({
      where: { alias },
    });

    if (!link) return res.status(404).send("Alias not found");

    let url = link.url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }
    await prisma.shortLink.update({
      where: {
        alias,
      },
      data: {
        count: { increment: 1 },
      },
    });
    res.redirect(302, url);
  } catch (error) {
    console.error("Error during redirection:", error);
    res.status(500).send("Internal server error");
  }
});

// Delete a shortlink
app.delete("/:alias", async (req, res) => {
  const alias = req.params.alias;
  try {
    await prisma.shortLink.delete({
      where: { alias },
    });
    res.json({ message: `Deleted alias '${alias}'` });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Alias not found" });
    }
    console.error("Error deleting alias:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Shortr running on port ${port}`);
});
