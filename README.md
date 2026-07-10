# Storyblok Placeholder Picker (Tool Plugin)

A Storyblok [Tool Plugin](https://www.storyblok.com/docs/plugins/tool-plugins) that embeds in the
Visual Editor's tool tab and lets content editors copy merge-tag placeholders
(e.g. `{{firstname}}`) for pasting into content fields — similar to Customer.io's
personalization tags.

Built on the official `storyblok/space-tool-plugins` Next.js starter, trimmed down
to what this tool needs: App Bridge validation to embed safely inside the Visual
Editor, and a searchable, copy-to-clipboard placeholder list. It does not call
Storyblok's Management API, so the OAuth flow, session storage, and `/api/connect`
routes from the original starter have been removed.

## What's here

- `src/data/placeholders.ts` — the list of placeholders, grouped by category.
  Edit this file to match your actual merge-tag syntax (Customer.io, Braze, etc.)
  and add/remove/rename entries.
- `src/components/PlaceholderPicker.tsx` — the search + copy UI.
- `src/pages/index.tsx` — wires up App Bridge (`oauth: false`) and renders the picker.
- `src/pages/api/_app_bridge.ts` + `src/utils/server/appBridge.ts` — verifies the
  App Bridge token using `CLIENT_SECRET` so Storyblok can confirm the tool is safe
  to embed. This is the only server-side piece left.

## Local development

```bash
npm install
npm run dev
```

Expose your local server over HTTPS (Storyblok's Visual Editor must load the tool
over https), e.g. with [ngrok](https://ngrok.com/):

```bash
ngrok http 3000
```

Note the ngrok URL — you'll use it as the tool's "Index to your page" setting.

### Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

- `CLIENT_SECRET` — from the Tool extension's settings page in Storyblok. Used
  only to verify the App Bridge token; no OAuth exchange happens.
- `NEXT_PUBLIC_TOOL_ID` — the extension's slug, also from the settings page.

## Editing the placeholder list

Open `src/data/placeholders.ts`. Each group looks like:

```ts
{
  category: 'Personal',
  items: [
    { label: 'First name', tag: '{{firstname}}' },
    ...
  ],
}
```

`tag` is exactly what gets copied to the clipboard, so make sure it matches the
merge-tag syntax your sending platform expects.

## Deferred: Storyblok extension + Netlify deploy

Setup of the Storyblok Tool extension (Partner Portal or Organization view) and
the Netlify deployment are intentionally left for later, per your request. When
you're ready:

1. **Deploy to Netlify** — this repo includes `netlify.toml` with
   `@netlify/plugin-nextjs` already configured. Push it to a git repo, connect it
   in Netlify, and set `CLIENT_SECRET` / `NEXT_PUBLIC_TOOL_ID` as environment
   variables in the Netlify site settings (you'll get `CLIENT_SECRET` from step 2
   below — it's a bit of a chicken-and-egg, so you may need to deploy once, create
   the extension, then update the env vars and redeploy).
2. **Create the Tool extension** in Storyblok:
   - Open the [Partner Portal](https://app.storyblok.com/#/partner/apps) or your
     [Organization apps view](https://app.storyblok.com/#/me/org/apps).
   - Click **New Extension**, fill in `name` and `slug`, select **Tool** as the
     extension type, and save.
   - Open the new extension → **OAuth 2.0 and Pages** tab, set:
     - **Index to your page**: your Netlify URL
     - **Redirection endpoint**: not needed (no OAuth flow in this tool), but the
       field may still require a value — you can point it at your Netlify URL.
   - Enable **Use App Bridge**.
   - Copy the generated **Client Secret** into your `.env.local` / Netlify env vars.
3. **Install the tool** to a space via the extension's Install Link, open a story,
   and use the tools tab to open the picker.
