#!/usr/bin/env node

/**
 * Shortr - URL Shortener API Server
 *
 * This Express.js server provides a RESTful API for creating and managing short URLs.
 * Features include:
 * - Create custom short links with aliases
 * - Redirect short links to target URLs
 * - Track click statistics
 * - Delete and update short links
 * - CORS support for frontend integration
 *
 * Database: SQLite with Prisma ORM
 * Port: 80 (configurable via environment)
 */

const express = require("express");
const prisma = require("../lib/prismaClient");

const app = express();
const port = process.env.PORT || 80; // Allow port configuration via environment

// CORS middleware - Enable cross-origin requests for frontend integration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Express middleware configuration
app.use(express.json({ limit: "1kb" })); // Limit JSON payload size for security
app.use(express.urlencoded({ extended: true, limit: "1kb" })); // Parse URL-encoded bodies

// Enable WAL mode for better SQLite concurrency and performance
// This allows multiple read operations while a write is in progress
prisma.$executeRawUnsafe("PRAGMA journal_mode=WAL");

/**
 * GET / - Retrieve all short links
 *
 * Returns a list of all short links with their metadata:
 * - alias: The short link identifier
 * - url: The target URL
 * - count: Number of times the link was clicked
 * - createdAt: When the link was created
 */
app.get("/", async (req, res) => {
  try {
    const links = await prisma.shortLink.findMany({
      select: { alias: true, url: true, count: true, createdAt: true },
    });
    res.status(200).json(links);
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST / - Create a new short link
 *
 * Request body:
 * - alias: Custom identifier for the short link (required)
 * - url: Target URL to redirect to (required)
 *
 * Returns the created short link object
 */
app.post("/", async (req, res) => {
  const { alias, url } = req.body;

  // Validate required fields
  if (!alias || !url) {
    return res.status(400).json({ error: "alias and url required" });
  }

  try {
    const newLink = await prisma.shortLink.create({
      data: { alias, url },
    });
    res.status(201).json(newLink);
  } catch (err) {
    // Handle duplicate alias error
    if (err.code === "P2002") {
      return res.status(409).json({ error: `Alias '${alias}' already exists` });
    }
    console.error("Error creating link:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /:alias - Redirect to target URL
 *
 * This is the main redirect endpoint that:
 * 1. Looks up the alias in the database
 * 2. Increments the click counter
 * 3. Redirects to the target URL
 *
 * Automatically adds 'http://' prefix if the URL doesn't have a protocol
 */
app.get("/:alias", async (req, res) => {
  const alias = req.params.alias;

  try {
    // Find the short link by alias
    const link = await prisma.shortLink.findUnique({
      where: { alias },
      select: { url: true },
    });

    if (!link) {
      return res.status(404).send("Alias not found");
    }

    let url = link.url;

    // Ensure URL has a protocol (default to http:// if missing)
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }

    // Increment click counter (non-blocking)
    await prisma.shortLink.update({
      where: { alias },
      data: { count: { increment: 1 } },
    });

    // Redirect to target URL with 302 (temporary redirect)
    res.redirect(302, url);
  } catch (error) {
    console.error("Error processing redirect:", error);
    res.status(500).send("Internal server error");
  }
});

/**
 * DELETE /:alias - Delete a short link
 *
 * Removes the specified short link from the database
 * Returns a success message or 404 if not found
 */
app.delete("/:alias", async (req, res) => {
  const alias = req.params.alias;

  try {
    await prisma.shortLink.delete({
      where: { alias },
    });
    res.json({ message: `Deleted alias '${alias}'` });
  } catch (err) {
    // Handle record not found error
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Alias not found" });
    }
    console.error("Error deleting link:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * PUT / - Update a short link
 *
 * Updates an existing short link's URL and resets the click counter
 * Request body:
 * - alias: The alias to update (required)
 * - url: New target URL (required)
 */
app.put("/", async (req, res) => {
  try {
    const { alias, url } = req.body;

    const updatedLink = await prisma.shortLink.update({
      where: { alias },
      data: {
        alias,
        url,
        count: 0, // Reset click counter on update
      },
    });
    res.status(201).json(updatedLink);
  } catch (err) {
    // Handle record not found error
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Alias not found" });
    }
    console.error("Error updating link:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Shortr API server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/`);
});
