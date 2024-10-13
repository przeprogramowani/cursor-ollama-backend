const express = require("express");
const https = require("https");
const fs = require("fs");
const axios = require("axios");
const {OLLAMA_MODEL, OLLAMA_API_URL} = require("./ollama-config");
const app = express();
app.use(express.json());

// SSL options
const options = {
  key: fs.readFileSync("./certificates/key.pem"),
  cert: fs.readFileSync("./certificates/cert.pem"),
};

// Handle POST requests to OpenAI Chat Completions API endpoint
app.post("/v1/chat/completions", async (req, res) => {
  try {
    console.log("Received request:", req.body);
    const {messages, model} = req.body;

    // Prepare the request payload for Ollama chat API
    const ollamaRequest = {
      model: OLLAMA_MODEL,
      stream: false,
      messages,
    };

    // Send request to the Ollama chat API
    const response = await axios.post(OLLAMA_API_URL, ollamaRequest, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Transform the Ollama response into OpenAI format
    const ollamaData = response.data;

    console.log(ollamaData.message);

    const openaiResponse = {
      id: "chatcmpl-" + Math.random().toString(36).substring(7),
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [
        {
          index: 0,
          message: ollamaData.message,
          logprobs: null,
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
        completion_tokens_details: {
          reasoning_tokens: 0,
        },
      },
    };

    res.json(openaiResponse);
  } catch (error) {
    console.error("Error:", error.message);
    console.error(
      "Response data:",
      error.response ? error.response.data : "No response data"
    );
    res.status(500).json({error: error.message});
  }
});

// Start HTTPS server
https.createServer(options, app).listen(443, () => {
  console.log("Ollama proxy is running on https://localhost");
});
