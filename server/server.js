const express = require("express");
const server = express();
const fetch = require("node-fetch");
const { saveCredentials } = require("./firebase");

server.all("/", (req, res) => {
  res.send("Result: [OK]");
});

const redirectUriDiscord = "http://localhost:3000/discord/callback";
const discordScopes = ["bot", "identify"]; // Discord OAuth2 scopes
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
// Discord OAuth2 URL Generator

server.get("/discord/callback", async (req, res) => {
  const discordCode = req.query.code;

  // Exchange the Discord authorization code for a token (not shown here)
  // Handle Discord authentication logic here

  // Redirect to Google OAuth2 URL
  const googleScopes = ["https://www.googleapis.com/auth/spreadsheets"]; // Google OAuth2 scopes
  const redirectUriGoogle = "http://localhost:3000/google/callback";
  const googleOAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${googleClientId}&scope=${googleScopes.join(
    "%20"
  )}&redirect_uri=${redirectUriGoogle}&response_type=code`;

  res.redirect(googleOAuthUrl);
});

// Google OAuth2 Callback
server.get("/google/callback", async (req, res) => {
  const googleCode = req.query.code;

  // Exchange the Google authorization code for an access token and possibly a refresh token
  const googleRedirectUri = "http://localhost:3000/google/callback";

  const tokenResponse = await fetch("https://accounts.google.com/o/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: googleClientId,
      client_secret: googleClientSecret,
      code: googleCode,
      redirect_uri: googleRedirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenResponse.json();
  const googleAccessToken = tokenData.access_token;
  const googleRefreshToken = tokenData.refresh_token;

  // Use the Google access token to make authenticated requests to Google APIs
  // Implement your Google API logic here

  // Save the tokens securely for future use
  await saveCredentials(googleAccessToken, googleRefreshToken);

  res.send("Google Authentication successful! You can now use the Google API.");
});

function keepAlive() {
  server.listen(3000, () => {
    console.log("Server is now ready! | " + Date.now());
  });
}

module.exports = keepAlive;
