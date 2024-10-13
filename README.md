## Ollama API proxy for Cursor

![](./_media/example.png)

This is a simple API proxy for Ollama API that allows you to redirect Cursor requests to local models.

## Prerequisites

You need to generate a self-signed SSL certificate to expose the API over HTTPS.

You can find the instructions in [CERT_README.md](./certificates/CERT_README.md).

## Usage

```
npm install
npm run start
```

Once the app is running, you can override base url in Cursor with `https://localhost`.

To redirect Cursor requests to this proxy, you need to enable one of OpenAI models in Cursor settings. Then, when using Chat or inline edit, use newly enabled model to call this proxy.
