import { describe, expect, it, vi } from "vitest";
import { contactEmail, pickContact, sendContactEmail, validateContact } from "./contact";

const good = { name: "Asha", email: "asha@example.com", order: "", subject: "Bulk order", message: "Do you sell 5 L tins?" };

describe("pickContact", () => {
  it("keeps only the known text fields, trimmed", () => {
    expect(pickContact({ name: "  Asha ", email: 3, extra: "x" })).toEqual({ name: "Asha", email: "", order: "", subject: "", message: "" });
    expect(pickContact(null).name).toBe("");
  });
});

describe("validateContact", () => {
  it("accepts a complete message", () => {
    expect(validateContact(good)).toEqual({});
  });
  it("needs a name, a real email and a message", () => {
    expect(Object.keys(validateContact({ ...good, name: "", email: "asha@", message: "" }))).toEqual(["name", "email", "message"]);
  });
  it("refuses over-long fields", () => {
    expect(validateContact({ ...good, message: "x".repeat(5001) }).message).toMatch(/under 5000/);
  });
});

describe("contactEmail", () => {
  it("replies to the visitor and keeps the subject on one line", () => {
    const email = contactEmail({ ...good, subject: "Hi\r\nBcc: x@y.z" }, { CONTACT_EMAIL_TO: "mill@example.com" });
    expect(email.reply_to).toBe("asha@example.com");
    expect(email.to).toEqual(["mill@example.com"]);
    expect(email.subject).toBe("Website enquiry: Hi Bcc: x@y.z");
    expect(email.text).toContain("Do you sell 5 L tins?");
  });
});

describe("sendContactEmail", () => {
  const quiet = { log: () => {}, logError: () => {} };

  it("only logs in tests and local runs without a key", async () => {
    const fetch = vi.fn();
    expect(await sendContactEmail(good, { ...quiet, env: { ORDERS_TEST_MODE: "1", RESEND_API_KEY: "re_x" }, fetch })).toBe("sent");
    expect(await sendContactEmail(good, { ...quiet, env: { NODE_ENV: "development" }, fetch })).toBe("sent");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("reports a missing key on the live site", async () => {
    expect(await sendContactEmail(good, { ...quiet, env: { NODE_ENV: "production" } })).toBe("not-set-up");
  });

  it("posts to Resend with the key", async () => {
    const fetch = vi.fn(async () => new Response("{}", { status: 200 }));
    const env = { NODE_ENV: "production", RESEND_API_KEY: "re_test", CONTACT_EMAIL_TO: "mill@example.com" };
    expect(await sendContactEmail(good, { ...quiet, env, fetch })).toBe("sent");
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer re_test");
  });

  it("fails when Resend refuses", async () => {
    const fetch = vi.fn(async () => new Response("bad", { status: 422 }));
    expect(await sendContactEmail(good, { ...quiet, env: { NODE_ENV: "production", RESEND_API_KEY: "re_test" }, fetch })).toBe("failed");
  });
});
