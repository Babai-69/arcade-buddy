import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

if (fs.existsSync(path.resolve(process.cwd(), '.env'))) {
  dotenv.config();
} else if (fs.existsSync(path.resolve(process.cwd(), '.env.example'))) {
  dotenv.config({ path: '.env.example' });
}

import express from "express";
import path from "path";
import * as cheerio from "cheerio";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Configuration
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.options("/api/notify-query", (req, res) => {
    res.sendStatus(200);
  });

  app.post("/api/notify-query", async (req, res) => {
    try {
      const { name, email, profileUrl, queryType, message, attachments } = req.body;
      
      // We check if SMTP credentials are provided, otherwise just mock it.
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log("Mocking email send since SMTP_USER and SMTP_PASS are not set.");
        console.log("Email Details:", req.body);
        return res.json({ success: true, mocked: true });
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,         // MUST be false for port 587
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,  // App Password here
        },
        tls: {
          rejectUnauthorized: false     // prevents TLS errors
        }
      });

      const mailOptions = {
        from: `"Arcade Buddy Contact" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,  // sends to yourself
        replyTo: email,          // user's email for easy reply
        subject: `New Query from ${name} — Arcade Buddy`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#4285F4">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background:#f5f5f5;padding:16px;border-radius:8px">
              ${message}
            </div>
            <hr/>
            <p style="color:#999;font-size:12px">
              Sent from Arcade Buddy contact form
            </p>
          </div>
        `,
        attachments: attachments && attachments.length > 0 
          ? attachments.map((a: any) => ({
              filename: a.filename,
              content: a.content,
              encoding: 'base64'
            }))
          : []
      };

      try {
        await transporter.verify();
        await transporter.sendMail(mailOptions);
        return res.json({ 
          success: true, 
          message: 'Query saved and email sent!' 
        });
      } catch (emailErr: any) {
        console.error('Email error:', emailErr.message);
        
        // Still return success for the saved query
        // but with a specific email error message
        return res.json({
          success: true,
          emailSent: false,
          message: emailErr.message.includes('Invalid login')
            ? 'Query saved! Email failed — invalid Gmail App Password.'
            : emailErr.message.includes('ECONNREFUSED') 
            ? 'Query saved! Email failed — cannot connect to Gmail SMTP.'
            : 'Query saved! Email notification failed: ' + emailErr.message
        });
      }
    } catch (error) {
      console.error("Failed to process request:", error);
      res.status(500).json({ error: "Failed to process request" });
    }
  });

  app.get("/api/arcade-spots", async (req, res) => {
    const fallbackData = {
      trooper:  { spotsLeft: 5227, total: 6000 },
      ranger:   { spotsLeft: 3927, total: 4000 },
      champion: { spotsLeft: 2989, total: 3000 },
      legend:   { spotsLeft: 2500, total: 2500 }
    };

    try {
      const response = await fetch('https://arcadepointscalci.in/calculator', {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'text/html'
        }
      });
      const html = await response.text();
      
      const extractSpots = (total: number) => {
        const regex = new RegExp(`(\\d+)\\s*/\\s*${total}\\s*spots? left`, 'i');
        const match = html.match(regex);
        if (match) {
          return parseInt(match[1].replace(/,/g, ''), 10);
        }
        return null;
      };

      const trooperSpots = extractSpots(6000) ?? fallbackData.trooper.spotsLeft;
      const rangerSpots = extractSpots(4000) ?? fallbackData.ranger.spotsLeft;
      const championSpots = extractSpots(3000) ?? fallbackData.champion.spotsLeft;
      const legendSpots = extractSpots(2500) ?? fallbackData.legend.spotsLeft;

      res.setHeader('Cache-Control', 's-maxage=1800');
      res.json({
        trooper: { spotsLeft: trooperSpots, total: 6000 },
        ranger: { spotsLeft: rangerSpots, total: 4000 },
        champion: { spotsLeft: championSpots, total: 3000 },
        legend: { spotsLeft: legendSpots, total: 2500 }
      });
    } catch (e) {
      res.setHeader('Cache-Control', 's-maxage=1800');
      res.json({ ...fallbackData, source: 'fallback' });
    }
  });

  app.get("/api/calculator", async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        return res.status(404).json({ error: "Profile not found or invalid URL" });
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);

      const profileName = $("ql-avatar").attr("title") || $("title").text().replace(" | Google Cloud Skills Boost", "").trim();

      let triviaBadges = 0;
      let gameBadges = 0;
      let skillBadges = 0;
      let specialBadges = 0;

      const seenBadges = new Set<string>();
      const badgesList: any[] = [];

      $(".profile-badge").each((i, el) => {
        const rawText = $(el).text() || "";
        const title = $(el).find(".badge-title, .ql-title-medium").text().trim() || $(el).attr('alt') || rawText || "";
        const titleLower = title.toLowerCase();

        // Extract the year and filter out badges from before 2026
        const dateText = $(el).find(".ql-body-medium.l-mbs, .ql-body-medium").text().trim();
        let earnedDate = dateText;
        if (dateText) {
          const match = dateText.match(/(20\d\d)/);
          if (match) {
            const year = parseInt(match[1], 10);
            if (year < 2026) return;
          }
        }

        if (!titleLower || seenBadges.has(titleLower)) return;
        seenBadges.add(titleLower);

        let category = "Other";
        let points = 0;

        // Classify badges
        if (
          titleLower.includes("the arcade") ||
          titleLower.includes("level 1") ||
          titleLower.includes("level 2") ||
          titleLower.includes("level 3") ||
          titleLower.includes("trail") ||
          titleLower.includes("voyage") ||
          titleLower.includes("adventure") ||
          titleLower.includes("sprint") ||
          titleLower.includes("arcade game") ||
          titleLower.includes("monthly game") ||
          titleLower.includes("base camp")
        ) {
          gameBadges++;
          category = "Game";
          points = 1;
        } else if (titleLower.includes("trivia") || titleLower.includes("quiz")) {
          triviaBadges++;
          category = "Trivia";
          points = 1;
        } else if (
          titleLower.includes("facilitator") ||
          titleLower.includes("work meet play") ||
          titleLower.includes("milestone") ||
          titleLower.includes("special") ||
          titleLower.includes("bonus") ||
          titleLower.includes("event")
        ) {
          specialBadges++;
          category = "Special";
          points = 1;
        } else {
          // Check for Lab-free courses (known titles from syllabus or similar matching)
          const labFreeTitles = [
            "digital transformation with google cloud",
            "exploring data transformation with google cloud",
            "infrastructure and application modernization with google cloud",
            "scaling with google cloud operations",
            "innovating with google cloud artificial intelligence",
            "trust and security with google cloud",
            "gen ai: beyond the chatbot",
            "gen ai: unlock foundational concepts",
            "google drive",
            "google docs",
            "google slides",
            "google meet",
            "google sheets",
            "google calendar",
            "gen ai: navigate the landscape",
            "gen ai apps: transform your work",
            "introduction to large language models",
            "responsible ai: applying ai principles with google cloud",
            "responsible ai for digital leaders with google cloud",
            "ai infrastructure: introduction to ai hypercomputer",
            "machine learning operations (mlops) with vertex ai: model evaluation",
            "conversational ai on vertex ai and dialogflow cx",
            "building complex end to end self-service experiences in dialogflow cx",
            "gen ai agents: transform your organization"
          ];

          if (labFreeTitles.includes(titleLower)) {
            category = "Lab-free";
            points = 0;
          } else {
            skillBadges++;
            category = "Skill";
            points = 0.5;
          }
        }

        badgesList.push({
          id: titleLower,
          title: title,
          earnedDate: earnedDate,
          category: category,
          points: points
        });
      });

      const arcadePoints = gameBadges + triviaBadges + specialBadges + (skillBadges / 2);

      // Determine avatar URL
      const avatarUrl = $("ql-avatar").attr("src") || "";

      res.json({
        name: profileName,
        avatarUrl,
        arcadePoints,
        gameBadges,
        triviaBadges,
        specialBadges,
        skillBadges,
        badges: badgesList
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });
  app.get("/api/milestones/spots", async (req, res) => {
    try {
      const response = await fetch("https://go.cloudskillsboost.google/arcade");
      let html = await response.text();
      
      // The page seems to escape HTML inside its content for some reason, so let's unescape it
      html = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
      
      const $ = cheerio.load(html);

      const spotsLeft: Record<string, { text: string, percent: string }> = {};

      $(".tier-card").each((i, el) => {
        const title = $(el).find(".tier-header .tier-card-title").text().trim();
        const spotsText = $(el).find(".tier-points").text().trim();
        const percent = $(el).find(".tier-percent-text").text().trim();

        if (title.includes("Trooper")) {
          spotsLeft["milestone-1"] = { text: spotsText, percent };
        } else if (title.includes("Ranger")) {
          spotsLeft["milestone-2"] = { text: spotsText, percent };
        } else if (title.includes("Champion")) {
          spotsLeft["milestone-3"] = { text: spotsText, percent };
        } else if (title.includes("Legend")) {
          spotsLeft["milestone-4"] = { text: spotsText, percent };
        }
      });

      res.json(spotsLeft);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to fetch spots left" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
