import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

if (fs.existsSync(path.resolve(process.cwd(), '.env'))) {
  dotenv.config();
} else if (fs.existsSync(path.resolve(process.cwd(), '.env.example'))) {
  dotenv.config({ path: '.env.example' });
}

import express from "express";
import cors from "cors";
import * as cheerio from "cheerio";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Configuration
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/notify-query", async (req, res) => {
    try {
      const { name, email, profileUrl, queryType, message, attachments } = req.body;
      
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (!smtpUser || !smtpPass) {
        return res.json({ success: true, emailSent: false, message: 'SMTP credentials not configured on server. Query saved to database.' });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: smtpUser,
        to: smtpUser, // Send to self or configured admin
        replyTo: email,
        subject: `[Support Query] ${queryType} - ${name}`,
        html: `
          <h2>New Support Query</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Profile URL:</strong> <a href="${profileUrl}">${profileUrl}</a></p>
          <p><strong>Query Type:</strong> ${queryType}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
        attachments: attachments ? attachments.map((att: any) => ({
          filename: att.filename,
          content: att.content,
          encoding: 'base64'
        })) : []
      };

      // Send email in background to avoid blocking the response
      transporter.sendMail(mailOptions).catch(err => {
        console.error('Background email sending failed:', err);
      });
      
      return res.json({ success: true, emailSent: true });
    } catch (error: any) {
      console.error('Failed to process request:', error);
      res.status(500).json({ success: false, message: error.message });
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
      const response = await fetch('https://go.cloudskillsboost.google/arcade');
      let html = await response.text();
      html = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
      const $ = cheerio.load(html);
      
      const extractSpots = (name: string, fallback: any) => {
        let spotsInfo = fallback;
        $(".tier-card").each((i, el) => {
           const title = $(el).find(".tier-header .tier-card-title").text().trim();
           if (title.toLowerCase().includes(name.toLowerCase())) {
             const spotsText = $(el).find(".tier-points").text().trim();
             const match = spotsText.match(/(\d+)\s*\/\s*(\d+)/);
             if (match) {
               spotsInfo = {
                 spotsLeft: parseInt(match[1].replace(/,/g, ''), 10),
                 total: parseInt(match[2].replace(/,/g, ''), 10)
               };
             }
           }
        });
        return spotsInfo;
      };

      const trooper = extractSpots("Trooper", fallbackData.trooper);
      const ranger = extractSpots("Ranger", fallbackData.ranger);
      const champion = extractSpots("Champion", fallbackData.champion);
      const legend = extractSpots("Legend", fallbackData.legend);

      res.setHeader('Cache-Control', 's-maxage=1800');
      res.json({
        trooper,
        ranger,
        champion,
        legend
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
          let cleanDateStr = dateText.replace("Earned ", "").replace(/ EDT| EST| PDT| PST/g, "").trim();
          let parsedDate = new Date(cleanDateStr);
          const START_DATE = new Date('2026-07-13T17:30:00-04:00'); // EDT
          const END_DATE = new Date('2026-09-14T23:59:59-04:00'); // EDT
          if (!isNaN(parsedDate.getTime())) {
            if (parsedDate < START_DATE || parsedDate > END_DATE) return;
          } else {
            const match = dateText.match(/(20\d\d)/);
            if (match) {
              const year = parseInt(match[1], 10);
              if (year !== 2026) return;
            }
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

  app.get("/api/active-games", async (req, res) => {
    try {
      const response = await fetch("https://go.cloudskillsboost.google/arcade");
      let html = await response.text();
      html = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
      const $ = cheerio.load(html);

      const games: any[] = [];
      $('.card').each((i, el) => {
        const link = $(el).find('a').attr('href');
        const img = $(el).find('img').attr('src');
        if (link && link.includes('skills.google/games/') && img) {
           let title = "Arcade Game";
           if (img.includes('bc') || img.includes('base')) title = "Arcade Base Camp";
           else if (img.includes('adv')) title = "Arcade Adventure";
           else if (img.includes('voy')) title = "Arcade Voyage";
           else if (img.includes('trail')) title = "Arcade Trail";
           else if (img.includes('work')) title = "New Monthly Game";
           else if (img.includes('logic')) title = "Special Monthly Game";
           
           let code = "Coming Soon!";
           const cardText = $(el).text();
           const parentText = $(el).parent().text();
           const match = cardText.match(/(?:access\s*code|code)[\s:]+([a-zA-Z0-9-]+)/i) || 
                         parentText.match(/(?:access\s*code|code)[\s:]+([a-zA-Z0-9-]+)/i);
           if (match && match[1]) {
             code = match[1];
           }

           games.push({ link, img, title, code });
        }
      });

      res.json({ games });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to fetch active games" });
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
