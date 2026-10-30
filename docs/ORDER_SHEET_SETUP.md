# Setting up the Neeram order sheet

Every order placed on the website will appear as a new row in a Google Sheet that you own, and every newsletter or "Notify me" sign-up as a row on a second tab of the same sheet. This guide sets that up once. It takes about 30–45 minutes and needs no coding.

**You will need:**

- The Google account that should own the orders (for example the shop's Gmail). Use the same account all the way through.
- Access to the website's project on Vercel (vercel.com), or someone who has it for the last part.
- A computer. These screens are hard to use on a phone.

**What you will end up with:** three values to paste into Vercel: an email address that ends in `iam.gserviceaccount.com`, a private key, and a sheet ID.

> **A word on the "robot" account.** The website can't log in as you. Instead, you create a small robot account (Google calls it a *service account*) that is allowed to add rows to your one order sheet and nothing else. It cannot see your email, your Drive or any other file.

---

## Part 1: Create a Google Cloud project

A "project" is just a folder in Google Cloud that holds the robot account. It's free. You won't be asked for a card for anything in this guide; if a screen asks for billing details, you've taken a wrong turn, so go back.

1. Go to **https://console.cloud.google.com** and sign in with the shop's Google account.
2. If this is your first visit, a welcome box asks you to agree to the terms of service. Choose your country, tick the box and click **Agree and continue**.
3. At the top left, next to the "Google Cloud" logo, there is a box showing a project name or **Select a project**. Click it. A window opens.
4. In the top-right corner of that window, click **New project**.
5. **Project name:** type `Neeram Orders`. Leave **Location** as it is ("No organisation" is fine). Click **Create**.
6. Wait about 10 seconds. A notification appears (bell icon, top right). Click **Select project** in it, or use the project box from step 3 again and click **Neeram Orders**.
7. Check that the box at the top now says **Neeram Orders**. Everything below must happen inside this project.

## Part 2: Turn on the Google Sheets API

This lets the robot account talk to Google Sheets.

1. Click in the search bar at the top of the page, type `Google Sheets API`, and click the result marked **Google Sheets API** (under "Marketplace" or "Products").
2. A page with the Sheets logo opens. Click the blue **Enable** button.
3. Wait until the page changes to an overview with graphs and a **Disable API** button. That means it's on. Nothing else to do here.

## Part 3: Create the robot account (service account)

1. Click the menu icon (three lines, ☰) at the top left, then **IAM & Admin** → **Service accounts**.
   (Or search the top bar for `Service accounts`.)
2. Click **+ Create service account** near the top.
3. **Step 1, Service account details:**
   - **Service account name:** `neeram-orders`
   - The **Service account ID** fills itself in. Leave it.
   - **Description:** `Adds website orders to the order sheet`
   - Click **Create and continue**.
4. **Step 2, Permissions (optional):** leave the role empty. Click **Continue**. (The robot needs no permissions in Google Cloud. It gets access only to the one sheet you share with it in Part 5.)
5. **Step 3, Principals with access (optional):** leave empty. Click **Done**.
6. You're back on the list. You'll see a row with an email like
   `neeram-orders@neeram-orders-123456.iam.gserviceaccount.com`.
   **Copy this email and keep it in a note.** This is value 1, `GOOGLE_SERVICE_ACCOUNT_EMAIL`.

## Part 4: Create the robot's key

The key is the robot's password. Treat it like one.

1. In the list of service accounts, click the email of `neeram-orders`.
2. Click the **Keys** tab at the top.
3. Click **Add key** → **Create new key**.
4. Choose **JSON** (it's usually already selected). Click **Create**.
5. A file downloads to your computer, with a name like `neeram-orders-123456-a1b2c3d4e5f6.json`. Google keeps no copy. If you lose it, you can make a new key the same way.

**Keep this file safe:**

- Don't email it, put it in WhatsApp, or upload it anywhere other than Vercel (Part 6).
- Don't put it inside the website's code folder.
- Once Part 6 is done, delete it from your Downloads (and empty the bin), or keep it in a password manager.

> **"Key creation is disabled" error?** This only happens on company (Google Workspace) accounts whose admin has blocked keys. Ask the Workspace admin to allow service account keys for this project, or create the project with a personal Gmail account instead.

### Finding the private key inside the file

1. Open the downloaded file with **Notepad** (Windows: right-click → **Open with** → **Notepad**) or **TextEdit** (Mac).
2. You'll see lines of text in quotes. Find the one that starts with `"private_key":`. Its value is long and looks like:
   ```
   "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASC...(many characters)...\n-----END PRIVATE KEY-----\n"
   ```
3. Copy **everything from `-----BEGIN PRIVATE KEY-----` up to and including `-----END PRIVATE KEY-----\n`**, without the quote marks at either end. The `\n` bits are fine. Leave them as they are.
   This is value 2, `GOOGLE_PRIVATE_KEY`.

## Part 5: Create the order sheet and share it with the robot

1. Go to **https://sheets.new** (signed in as the shop's account). A blank spreadsheet opens.
2. Click **Untitled spreadsheet** at the top left and rename it `Neeram Orders`.
3. Click cell **A1**, then paste this whole line. It fills row 1 with the column headings, A to P:

   ```
   Order no	Date & time (IST)	Name	Phone	Email	Address	Landmark	City	State	PIN	Items (product · size · qty)	Subtotal	Delivery	Total	Status	Notes
   ```

   If everything lands in cell A1 instead of spreading across, undo, and type the headings one per cell instead, in exactly this order:
   **A** Order no · **B** Date & time (IST) · **C** Name · **D** Phone · **E** Email · **F** Address · **G** Landmark · **H** City · **I** State · **J** PIN · **K** Items (product · size · qty) · **L** Subtotal · **M** Delivery · **N** Total · **O** Status · **P** Notes
4. Optional but handy: **View** → **Freeze** → **1 row**, so the headings stay visible as orders pile up.
5. Add the tab for newsletter sign-ups:
   - At the bottom left, click **+** (Add sheet). A tab called "Sheet2" appears to the right of the first one.
   - Double-click "Sheet2" and rename it to exactly `Newsletter` (capital N, nothing else). The website looks for this name.
   - Click cell **A1** of the new tab and paste this line:

     ```
     Date & time (IST)	Email	Page
     ```

     Or type them one per cell: **A** Date & time (IST) · **B** Email · **C** Page.
   - **Page** shows where on the website the person signed up, for example `/about`. For "Notify me" sign-ups it also names the product, for example `/products/turmeric (Notify me: Turmeric)`, so you know whom to email when that product arrives.
   - Click the first tab again before going on.
6. Click the green **Share** button (top right).
7. In **Add people, groups…**, paste the robot's email from Part 3 (`neeram-orders@…iam.gserviceaccount.com`).
8. On the right, make sure the role says **Editor**. The robot needs Editor to add rows.
9. **Untick "Notify people"** (the robot has no inbox). Click **Share** (or **Send**).
   If Google warns that the address is outside your organisation, click **Share anyway**.
10. Find the **sheet ID** in the address bar. The address looks like:
   ```
   https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz0123456789/edit#gid=0
   ```
   The sheet ID is the long part **between `/d/` and `/edit`**, here `1AbCdEfGhIjKlMnOpQrStUvWxYz0123456789`.
   This is value 3, `GOOGLE_SHEET_ID`.

**Rules for the sheet, so new orders keep landing in the right place:**

- Keep the orders on the **first tab**. You can add other tabs after it, but don't move another tab in front.
- Keep the **Newsletter** tab's name exactly as it is.
- Don't delete row 1 on either tab, and don't insert, delete or reorder the website's columns (A–P for orders, A–C for Newsletter). Add your own columns after them if you need more.
- Fill in **Delivery**, **Total** and **Status** yourself (for example `Paid`, `Shipped`). The website leaves them blank and never changes a row once it's added.
- Share the sheet only with the people who handle orders. It contains customers' names, phone numbers and addresses.

## Part 6: Add the three values in Vercel

1. Go to **https://vercel.com**, sign in, and open the Neeram project.
2. Click **Settings** (top menu), then **Environment Variables** (left menu).
3. Add the first value:
   - **Key:** `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - **Value:** the robot's email from Part 3
   - **Environments:** tick **Production** only. Untick Preview and Development, so test versions of the site never write to the real sheet.
   - Click **Save**.
4. Add the second value the same way:
   - **Key:** `GOOGLE_PRIVATE_KEY`
   - **Value:** the private key from Part 4, starting `-----BEGIN PRIVATE KEY-----` and ending `-----END PRIVATE KEY-----\n`
   - If there's a **Sensitive** switch, turn it on.
   - **Environments:** Production only. **Save**.
5. Add the third:
   - **Key:** `GOOGLE_SHEET_ID`
   - **Value:** the sheet ID from Part 5, step 10
   - **Environments:** Production only. **Save**.
6. Vercel only picks up new values on the next deploy. Click **Deployments** (top menu). On the top (newest) deployment, click the **⋯** menu → **Redeploy** → **Redeploy**. Wait until it says **Ready**.
7. Now delete the key file from your computer (see Part 4).

## Part 7: Check it works

1. On the live website, place a small test order: add an item, check out, and use your own details with `TEST` in the note. Press **Send order on WhatsApp**. You don't need to actually send the WhatsApp message.
2. Open the order sheet. Within about 10 seconds a new row should appear with the order number, time, your details and the items. (The website shows the customer the WhatsApp step straight away and adds the row just after, so customers never wait for Google.)
3. Delete that test row (right-click the row number → **Delete row**).
4. In the website's footer, sign up for the newsletter with your own email. A row should appear on the **Newsletter** tab. Delete it too.

### If no row appears

1. In Vercel, open the project → **Logs** (top menu).
2. In the search box, type `NOT SAVED TO SHEET`. This finds both kinds of problem:
   - `ORDER NOT SAVED TO SHEET`: an order, listed **in full** (name, phone, address, items).
   - `NEWSLETTER SIGN-UP NOT SAVED TO SHEET`: a sign-up, with the email and page.

   The website tries twice before giving up, so nothing is lost. You can copy these into the sheet by hand.
3. The text after the tag says why:

| Message contains | What it means | Fix |
|---|---|---|
| `Sheet not set up` | One of the three values is missing in Vercel, or you didn't redeploy | Check Part 6, all three under **Production**, then redeploy |
| `Google sign-in failed: 400` / `invalid_grant` | The private key or email is wrong | Paste the email and key again (Part 3 and Part 4), then redeploy. If in doubt, make a new key |
| `Sheets append failed: 403` | The sheet isn't shared with the robot, or the Sheets API is off | Share the sheet with the robot's email as **Editor** (Part 5), and check Part 2 |
| `Sheets append failed: 404` | The sheet ID is wrong | Copy the ID again from the sheet's address (Part 5, step 10), then redeploy |
| `Sheets append failed: 400` … `Unable to parse range: Newsletter` (sign-ups only) | The Newsletter tab is missing or renamed | Add or rename the tab to exactly `Newsletter` (Part 5, step 5) |
| `aborted` or `timeout` | Google took longer than 5 seconds twice | Usually a brief Google hiccup. If it keeps happening, tell the website's developer |

Customers can always finish their order on WhatsApp, even when the sheet isn't working. The sheet is your record; WhatsApp is still where orders arrive.

---

## Later: replacing the key

If the key may have been seen by someone else, or a person who had it leaves:

1. Part 4 again: **Add key** → **Create new key** → JSON.
2. Put the new private key into `GOOGLE_PRIVATE_KEY` in Vercel and redeploy.
3. Place a test order to confirm it works.
4. Back on the robot's **Keys** tab, delete the old key (bin icon next to the older key ID).
