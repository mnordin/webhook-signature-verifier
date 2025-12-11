"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [webhook, setWebhook] = useState({
    url: "/api/webhook",
    method: "POST",
    secretKey: "sharedSecretHere",
    headerName: "X-Signature",
    responseStatus: null,
    responseBody: null,
    payload:
      '{\n  "event": "example",\n  "data": {\n    "id": 123,\n    "name": "Test"\n  }\n}',
    signature: "",
    requestSent: false,
    loading: false,
    computingSignature: false,
  });

  // Calculate signature when payload changes
  useEffect(() => {
    const computeSignature = async () => {
      if (!webhook.payload) return;

      try {
        setWebhook((prev) => ({ ...prev, computingSignature: true }));

        const response = await fetch("/api/compute-signature", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: webhook.payload,
        });

        if (!response.ok) {
          throw new Error("Failed to compute signature");
        }

        const result = await response.json();

        setWebhook((prev) => ({
          ...prev,
          signature: result.signature,
          computingSignature: false,
        }));
      } catch (error) {
        console.error("Failed to compute signature:", error);
        setWebhook((prev) => ({
          ...prev,
          signature: "Error computing signature",
          computingSignature: false,
        }));
      }
    };

    // Debounce the signature computation
    const timeoutId = setTimeout(() => {
      computeSignature();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [webhook.payload]);

  const sendWebhook = async () => {
    setWebhook((prev) => ({ ...prev, loading: true, requestSent: true }));

    try {
      const response = await fetch(webhook.url, {
        method: webhook.method,
        headers: {
          "Content-Type": "application/json",
          [webhook.headerName]: webhook.signature,
        },
        body: webhook.payload,
      });

      const responseText = await response.text();

      setWebhook((prev) => ({
        ...prev,
        responseStatus: response.status,
        responseBody: responseText,
        loading: false,
      }));
    } catch (error) {
      setWebhook((prev) => ({
        ...prev,
        responseStatus: "Error",
        responseBody: error.message,
        loading: false,
      }));
    }
  };

  const copySignature = () => {
    navigator.clipboard.writeText(webhook.signature);
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Webhook Signature Verifier</h1>
      <p className={styles.description}>
        This tool helps you debug webhook signatures by verifying HMAC SHA-256
        signatures. Check server logs for detailed debugging information.
      </p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2>Test Your Webhook</h2>

          <div className={styles.formGroup}>
            <label>Payload (JSON):</label>
            <textarea
              value={webhook.payload}
              onChange={(e) =>
                setWebhook((prev) => ({ ...prev, payload: e.target.value }))
              }
              rows={10}
              className={styles.textarea}
              placeholder="Enter your JSON payload here"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Signature (HMAC SHA-256):</label>
            <div className={styles.signatureContainer}>
              <input
                type="text"
                value={webhook.signature}
                readOnly
                className={styles.signatureInput}
                placeholder={
                  webhook.computingSignature
                    ? "Computing signature..."
                    : "Signature will appear here"
                }
              />
              <button
                onClick={copySignature}
                className={styles.copyButton}
                disabled={!webhook.signature || webhook.computingSignature}
              >
                Copy
              </button>
            </div>
            <p className={styles.signatureHelp}>
              {webhook.computingSignature
                ? "Computing signature..."
                : "This signature is automatically calculated based on your payload"}
            </p>
          </div>

          <div className={styles.formGroup}>
            <label>Important Notes:</label>
            <ul className={styles.notesList}>
              <li>
                The signature is calculated server-side using HMAC SHA-256
              </li>
              <li>
                The shared secret is: <code>{webhook.secretKey}</code>
              </li>
              <li>
                The signature header is: <code>{webhook.headerName}</code>
              </li>
              <li>All webhook details are logged to the server console</li>
            </ul>
          </div>

          <button
            onClick={sendWebhook}
            disabled={webhook.loading || webhook.computingSignature}
            className={styles.button}
          >
            {webhook.loading ? "Sending..." : "Send Webhook"}
          </button>

          {webhook.requestSent && (
            <div className={styles.responseSection}>
              <h3>Response:</h3>
              <div className={styles.responseStatus}>
                Status:{" "}
                <span
                  className={
                    webhook.responseStatus === 200
                      ? styles.success
                      : styles.error
                  }
                >
                  {webhook.responseStatus}
                </span>
              </div>
              <div className={styles.responseBody}>
                <pre>{webhook.responseBody}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
