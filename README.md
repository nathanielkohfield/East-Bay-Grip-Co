# East Bay Prop Co. — Website Project

This folder is a complete, ready-to-deploy website. It's the same
prototype you've been previewing in chat, packaged so you can put it
online yourself with no developer.

## What's inside

```
east-bay-prop-co/
├── index.html          the page shell
├── src/
│   ├── App.jsx           the whole site (edit this to change content)
│   ├── main.jsx          wiring, you shouldn't need to touch this
│   └── index.css         styling setup, you shouldn't need to touch this
├── package.json         list of dependencies
└── (config files)        vite/tailwind setup, you shouldn't need to touch these
```

You will mainly ever edit **`src/App.jsx`**. That's the whole site —
the inventory list, prices, copy, colors, and layout.

---

## Option A: Deploy straight from these files (fastest, no coding)

Both Vercel and Netlify let you drag-and-drop a project folder or
connect it via GitHub. GitHub is the better long-term option because
it means every future edit auto-deploys, but drag-and-drop works too
for a first pass. Steps below use GitHub, since it'll save you time
the moment you want to change anything.

### 1. Put this folder on GitHub
1. Create a free account at github.com if you don't have one.
2. Create a new repository (e.g. `east-bay-prop-co`).
3. Upload this whole folder to it. Easiest way: on the repo page,
   click **Add file → Upload files**, then drag in everything from
   this folder (keep the `src` folder structure intact).

### 2. Connect it to Vercel or Netlify
**Vercel:**
1. Sign up at vercel.com (free tier is fine).
2. Click **Add New → Project**, choose **Import Git Repository**, and
   pick the repo you just created.
3. Vercel auto-detects it's a Vite project. Leave the settings as
   default and click **Deploy**.
4. In a minute or two you'll get a live URL like
   `east-bay-prop-co.vercel.app`.

**Netlify (same idea):**
1. Sign up at netlify.com.
2. Click **Add new site → Import an existing project**, connect
   GitHub, and pick the repo.
3. Build command: `npm run build` — Publish directory: `dist`
   (Netlify usually fills these in automatically for a Vite project).
4. Click **Deploy site**.

### 3. Add your real domain
Once it's live on a `.vercel.app` or `.netlify.app` address, both
platforms have a **Domain settings** page where you can connect
`eastbayprop.co` (or whatever you register) — they walk you through
adding a couple of DNS records with your domain registrar (GoDaddy,
Namecheap, Google Domains, etc.).

---

## Option B: Run it on your own computer first (optional, to preview before deploying)

If you want to see it locally before going live:
1. Install Node.js (the LTS version) if you don't have it.
2. Open a terminal in this folder and run:
   ```
   npm install
   npm run dev
   ```
3. It'll print a local address like `http://localhost:5173` — open
   that in your browser.

---

## Editing the site

Everything lives in `src/App.jsx`. A few common edits:

- **Inventory items** — near the top of the file, the `ITEMS` array.
  Each line is one prop: id, name, category, dimensions, and day
  rate. Copy the pattern to add more, or edit existing lines.
- **Colors** — search for the block starting with `"--ink":` — those
  are all the site's colors in one place. The accent color used for
  prices/buttons is `--plum`.
- **Contact info / address** — search for "Dock Street" and the phone
  number near the bottom of the file, in the footer section.
- **Delivery fee** — search for `85` to find the flat delivery fee
  logic.
- **Photo placeholders** — search for `PhotoPanel` and `TONES`. Each
  category currently renders a toned gradient with an icon. Swap
  these for real `<img>` tags once you have product photography.

Every time you push a change to GitHub, Vercel/Netlify will
automatically rebuild and redeploy the live site within a minute or
two — no re-uploading needed after the first setup.

---

## What this version does NOT do yet (things to add next)

- **"Request Quote" doesn't send anywhere yet.** Right now it just
  shows a confirmation message on screen. To actually receive these
  requests, the easiest no-code option is a form service like
  Formspree — free tier available, a few lines added to the submit
  function point it at your email.
- **No real payment processing.** Adding Stripe or Square checkout is
  a separate step once you're ready to charge deposits or full
  rentals online.
- **No analytics.** Adding Google Analytics or Plausible is a single
  small script tag — easy to add whenever you're ready to track
  visitor traffic.
- **Inventory is hardcoded**, not pulled from Sortly or any database.
  Fine for a first launch; worth revisiting once your catalog is
  changing often.
- **Images are still styled placeholders**, not real photos. Swap
  them into the `PhotoPanel` component whenever you have product
  photography ready.

Happy to help with any of these next, whenever you're ready.
