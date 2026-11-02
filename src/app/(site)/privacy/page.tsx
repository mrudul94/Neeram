import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { site } from "@/data/content";
import { toBeConfirmed } from "@/lib/format";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What Neeram collects when you order or sign up, who receives it, and your rights.",
};

const officer = site.grievanceOfficer;

// Draft written from what the site actually does; a lawyer reviews it before launch.
const sections: LegalSection[] = [
  {
    id: "who",
    title: "Who we are",
    body: (
      <p>
        This website is run by {site.legalName}, {toBeConfirmed(site.address)}. We are responsible for the personal data you give us here.
      </p>
    ),
  },
  {
    id: "collect",
    title: "What we collect",
    body: (
      <>
        <p>When you place an order: your name, mobile number, delivery address, any landmark or note you add, your email if you give it, and what you ordered.</p>
        <p>When you sign up for the newsletter or a &ldquo;Notify me&rdquo; message: your email address and the page you signed up on.</p>
        <p>We do not take card or bank details on this website. Nothing is charged here.</p>
      </>
    ),
  },
  {
    id: "why",
    title: "Why we use it",
    body: (
      <p>
        To confirm and deliver your order, to contact you about it, to keep our records, and to send the messages you signed up for. You can unsubscribe at any time. We do not sell your data, and this
        website has no advertising or analytics trackers.
      </p>
    ),
  },
  {
    id: "share",
    title: "Who receives it",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Google: orders and sign-ups are saved in our Google Sheet.</li>
        <li>WhatsApp: the order message goes through WhatsApp when you choose to send it, under WhatsApp&rsquo;s own terms.</li>
        <li>Cloudflare: hosts this website, keeps short-lived technical logs, and runs a security check on our forms that uses your IP address and browser details to block bots.</li>
        <li>Delivery partners: your name, number and address, to deliver your order. [Delivery partners: to be confirmed.]</li>
      </ul>
    ),
  },
  {
    id: "browser-storage",
    title: "Cookies and browser storage",
    body: (
      <>
        <p>We only use what the site needs to work. Your browser remembers your cart, and that you closed our notice about this. Both stay on your device, and clearing your browser data removes them.</p>
        <p>Cloudflare&rsquo;s security check may set a cookie to tell people from bots. There are no advertising or analytics cookies.</p>
      </>
    ),
  },
  {
    id: "keep",
    title: "How long we keep it",
    body: <p>Order records: {toBeConfirmed(site.dataRetention)}. Sign-ups: until you unsubscribe. We may keep some records longer where the law requires it.</p>,
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <p>
        You can ask to see, correct or delete your personal data, withdraw your consent, or name someone to act for you. Write to the Grievance Officer below. Some order records may have to be kept by
        law. If you are under 18, please order with a parent or guardian.
      </p>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: <p>Access to order records is limited to the people who handle orders. If a breach affects your data, we will tell you and the authorities as the law requires.</p>,
  },
  {
    id: "grievance",
    title: "Grievance Officer",
    body: (
      <p>
        {toBeConfirmed(officer.name)}, {toBeConfirmed(officer.designation)}. Phone: {toBeConfirmed(officer.phone)}. Email: {toBeConfirmed(officer.email)}. We acknowledge complaints within 48 hours and
        resolve them within one month.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes",
    body: <p>If this policy changes, we will update this page and its date.</p>,
  },
];

export default function PrivacyPage() {
  return <LegalPage title="Privacy policy" updated="2 November 2026" draft sections={sections} />;
}
