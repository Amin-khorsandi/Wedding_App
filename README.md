# Ya Ali Goftimo Eshgh Aghaz Shod Playlist

Shared wedding playlist. Guests play 30-second previews, like or dislike songs,
add songs and remove them — everyone sees the same list.

## Files

    index.html                     the app
    netlify.toml                   publish + functions settings
    package.json                   one dependency
    netlify/functions/store.mjs    the API, stores the list in Netlify Blobs
    netlify/functions/ping.mjs     a no-dependency health check

## Putting these in the repo

Upload the FILES, do not copy-paste their contents. GitHub's web editor does
not always replace the whole file when you paste over a long one, which leaves
a mangled half-and-half file. Delete the old file, then Add file > Upload files.

`index.html` goes wherever your publish directory points (`public/` if
netlify.toml says publish = "public", otherwise the repo root).

Delete the old `netlify/functions/playlist.mjs` if it is still there. The
function is called `store.mjs` now, on purpose: a new filename means Netlify
cannot reuse a stale cached bundle.

Then: Deploys > Trigger deploy > **Clear cache and deploy site**.

## Checking a deploy — two URLs, in this order

1. `https://your-site.netlify.app/api/ping`

       {"ok":true,"ping":"alive",...}   functions run on this deploy
       502 or 404                       the deploy is broken, storage is not
                                        the problem — check the build log for
                                        "new function(s) to upload"

2. `https://your-site.netlify.app/api/playlist`

       {"ok":true,"diag":{"blobs":"ok",...}}   everything works
       {"ok":true,"diag":{"blobs":"<message>"}} functions fine, storage is not,
                                                and the message says why

The app runs the same check itself, so the badge in the toolbar reads either
"functions OK, storage failed" or "no function deployed" instead of a bare
error code.

## Everyday use

On the first visit the app copies its built-in 50 songs into the store. After
that the store is the only source of truth — likes, edits, additions and
deletions all go through it, and every browser refreshes every 5 seconds and
whenever someone returns to the tab.

Change songs in the app itself (pencil icon, or **+ Add song**). Editing
index.html only changes the starter list, which is ignored once the store has
data.

## Notes

- Anyone with the URL can vote, add and delete — the point for a guest list,
  but keep the URL off public pages. Site configuration > Access & security >
  Password protection adds a shared password if you want one.
- Previews come from Apple's public catalogue. Songs it does not carry get a
  red button that opens a YouTube search instead.
- Opened straight off your computer, the app still works and saves to that
  browser only.
