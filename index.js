const express = require('express');
const fs = require('fs');
const { spawn } = require("child_process");
const chalk = require('chalk');
const path = require('path');
const axios = require("axios");
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Remove /dashboard route for bot information related to REPL
app.get('/dashboard', async (req, res) => {
  const commandsCount = getFilesCount(commandsPath);
  const eventsCount = getFilesCount(eventsPath);
  const uptime = Date.now() - botStartTime;
  const botInformation = await getBotInformation();

  res.json({
    botPing: botInformation.bot.ping,
    botLang: botInformation.bot.lang,
    botFmd: botInformation.bot.fmd,
    botName: botInformation.bot.name,
    botUid: botInformation.bot.uid,
    ownerName: botInformation.owner.name,
    ownerUid: botInformation.owner.uid,
    prefix: config.PREFIX,
    commandsCount: commandsCount,
    eventsCount: eventsCount,
    uptime: uptime
  });
});

// Keep the / route for serving harold.html or any other static content
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'harold.html')));

// Remove references to REPL-specific configurations and environment variables

// Remove socket.io integration if not needed
io.on('connection', (socket) => {
  console.log('New client connected');
  // Remove sendLiveData function and its setInterval
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Remove startBot function and its related code
// Remove server start code related to bot process
const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
