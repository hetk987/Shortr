#!/usr/bin/env node

const express = require("express");
const prisma = require("../lib/prismaClient");

const app = express();
const port = 80;

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Express middleware
app.use(express.json({ limit: "1kb" }));
app.use(express.urlencoded({ extended: true, limit: "1kb" }));

// Enable WAL mode for better SQLite concurrency
prisma.$executeRawUnsafe("PRAGMA journal_mode=WAL");

// Get all shortlinks
app.get("/", async (req, res) => {
  try {
    const links = await prisma.shortLink.findMany({
      select: { alias: true, url: true, count: true, createdAt: true },
    });
    res.status(200).json(links);
  } catch {
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
    res.status(500).json({ error: "Internal server error" });
  }
});

// Redirect using alias
app.get("/:alias", async (req, res) => {
  const alias = req.params.alias;
  try {
    const link = await prisma.shortLink.findUnique({
      where: { alias },
      select: { url: true },
    });

    if (!link) return res.status(404).send("Alias not found");

    let url = link.url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }

    await prisma.shortLink.update({
      where: { alias },
      data: { count: { increment: 1 } },
    });

    res.redirect(302, url);
  } catch {
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
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update Alias
app.put("/", async (req, res) => {
  try {
    const { alias, url } = req.body;
    const updatedLink = await prisma.shortLink.update({
      where: { alias },
      data: {
        alias,
        url,
        count: 0,
      },
    });
    res.status(201).json(updatedLink);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Alias not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port);
