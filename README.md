# Ya Ali Goftimo Eshgh Aghaz Shod Playlist

A shared wedding playlist. Guests play 30-second previews, like or dislike each
song, add songs and remove them — and everyone sees the same list.

    public/index.html                 the app
    netlify/functions/playlist.mjs    the API, stores the list in Netlify Blobs
    netlify.toml                      publish + functions directories
    package.json                      one dependency

## Deploy

Functions need a build, and a drag-and-drop deploy doesn't run one, so this goes
up through Git:

1. Create a new repository on GitHub. On the repo page choose
   **Add file > Upload files** and upload these four items, keeping the folder
   structure (drag the whole project folder in and GitHub preserves it).
2. In Netlify: **Add new site > Import an existing project**, pick GitHub and
   the repository you just made.
3. Leave the build command empty. Publish directory is `public`. Deploy.

That's it — no keys, no accounts to configure. Netlify installs
`@netlify/blobs`, bundles the function, and the site answers at
`/api/playlist`.

On the first visit the app copies its built-in 50 songs into the store. After
that the store is the single source of truth: likes, edits, additions and
deletions all go through it, and the app refreshes every 5 seconds and whenever
someone returns to the tab.

## Changing the songs later

Edit them in the app itself — the pencil icon on each card, or **+ Add song**.
Editing `public/index.html` only changes the starter list, which is ignored once
the store has data.

## Notes

- Anyone with the site URL can vote, add and delete. That is the point for a
  guest list, but the URL is worth keeping off public pages. Netlify's
  Site configuration > Access & security > Password protection adds a shared
  password if you want one.
- Previews come from Apple's public catalogue. Songs it doesn't carry get a red
  button that opens a YouTube search instead.
- Opening `public/index.html` directly from your computer still works; with no
  function behind it, it just saves to that browser instead of sharing.
