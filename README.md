# Ya Ali Goftimo Eshgh Aghaz Shod Playlist

A shared wedding playlist. Guests play 30-second previews, like or dislike
songs, add songs and remove them — everyone sees the same list.

## What goes in the repo

Four things, at the top level:

    index.html                        the app
    netlify.toml                      publish + functions settings
    package.json                      one dependency
    netlify/functions/playlist.mjs    the API, stores the list in Netlify Blobs

Only `playlist.mjs` is inside folders. Everything else is at the root.

## Uploading to GitHub

Upload `index.html`, `netlify.toml` and `package.json` normally
(**Add file > Upload files**).

For the function, do NOT upload it — GitHub's uploader flattens folders.
Instead use **Add file > Create new file** and type this as the filename:

    netlify/functions/playlist.mjs

Typing the slashes creates the folders as you go. Paste the contents of
playlist.mjs into the editor and commit.

## Deploying

In Netlify: **Add new site > Import an existing project**, pick the repo.
Leave the build command empty. The publish directory comes from netlify.toml.

## Checking it worked

Visit `https://your-site.netlify.app/api/playlist` in a browser.

    {"ok":false,"error":"POST only"}     the function is live — you're done
    a 404, or the app's HTML                  the function didn't deploy

You can also confirm under the site's **Functions** tab, which should list
`playlist`.

## Everyday use

On the first visit the app copies its built-in 50 songs into the store. After
that the store is the only source of truth — likes, edits, additions and
deletions all go through it, and every browser refreshes every 5 seconds and
whenever someone returns to the tab.

Change songs in the app itself (the pencil icon, or **+ Add song**). Editing
index.html only changes the starter list, which is ignored once the store has
data.

## Notes

- Anyone with the URL can vote, add and delete — that's the point for a guest
  list, but keep the URL off public pages. Site configuration > Access &
  security > Password protection adds a shared password if you want one.
- Previews come from Apple's public catalogue. Songs it doesn't carry get a red
  button that opens a YouTube search instead.
- Opening index.html straight off your computer still works; with no function
  behind it, it saves to that browser instead of sharing.
