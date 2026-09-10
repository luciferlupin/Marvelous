import { spawn } from "node:child_process";
import fs from "node:fs/promises";

async function run() {
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless",
    "--disable-gpu",
    "--remote-debugging-port=9222",
    "--window-size=1440,1050",
    "about:blank",
  ]);

  await new Promise((r) => setTimeout(r, 1200));

  try {
    const res = await fetch("http://127.0.0.1:9222/json/new?http://localhost:5173/?phase=complete", {
      method: "PUT",
    });
    const data = await res.json();
    const ws = new WebSocket(data.webSocketDebuggerUrl);

    await new Promise((resolve) => {
      ws.onopen = resolve;
    });

    let id = 1;
    const send = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const curId = id++;
        const handler = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === curId) {
            ws.removeEventListener("message", handler);
            if (msg.error) reject(msg.error);
            else resolve(msg.result);
          }
        };
        ws.addEventListener("message", handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });

    await send("Page.enable");
    await send("Runtime.enable");

    // Wait for page load
    await new Promise((r) => setTimeout(r, 1500));

    // Scroll to leadership section
    await send("Runtime.evaluate", {
      expression: `
        const el = document.getElementById("leadership");
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.dispatchEvent(new Event('scroll'));
      `,
    });

    // Wait for LERP animation to settle
    await new Promise((r) => setTimeout(r, 900));

    const shot1 = await send("Page.captureScreenshot", { format: "png" });
    await fs.writeFile(
      "/Users/harshitgoyal/marvelous/public/assets/capture-leadership.png",
      Buffer.from(shot1.data, "base64")
    );
    console.log("Saved capture-leadership.png");

    // Scroll down a bit more to see the cards fully
    await send("Runtime.evaluate", {
      expression: `
        window.scrollBy({ top: 220, behavior: 'instant' });
        window.dispatchEvent(new Event('scroll'));
      `,
    });
    await new Promise((r) => setTimeout(r, 900));
    const shot2 = await send("Page.captureScreenshot", { format: "png" });
    await fs.writeFile(
      "/Users/harshitgoyal/marvelous/public/assets/capture-leadership-cards.png",
      Buffer.from(shot2.data, "base64")
    );
    console.log("Saved capture-leadership-cards.png");

    // Scroll deeper into leadership section to showcase the light travertine color motion transition
    await send("Runtime.evaluate", {
      expression: `
        window.scrollBy({ top: 380, behavior: 'instant' });
        window.dispatchEvent(new Event('scroll'));
      `,
    });
    await new Promise((r) => setTimeout(r, 1000));
    const shotColorMotion = await send("Page.captureScreenshot", { format: "png" });
    await fs.writeFile(
      "/Users/harshitgoyal/marvelous/public/assets/capture-leadership-colormotion.png",
      Buffer.from(shotColorMotion.data, "base64")
    );
    console.log("Saved capture-leadership-colormotion.png");

    // Scroll to booking section
    await send("Runtime.evaluate", {
      expression: `
        const el = document.getElementById("booking");
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.dispatchEvent(new Event('scroll'));
      `,
    });
    await new Promise((r) => setTimeout(r, 900));
    const shot3 = await send("Page.captureScreenshot", { format: "png" });
    await fs.writeFile(
      "/Users/harshitgoyal/marvelous/public/assets/capture-booking.png",
      Buffer.from(shot3.data, "base64")
    );
    console.log("Saved capture-booking.png");

    ws.close();
  } catch (err) {
    console.error("Error during capture:", err);
  } finally {
    chrome.kill();
  }
}

run();
