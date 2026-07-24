import { getStore } from "@netlify/blobs";

/**
 * The playlist API. One JSON document in Netlify Blobs holds the whole list,
 * which is the right shape for ~50 rows and a few dozen guests.
 *
 * POST /api/playlist   { op: "list" }
 *                      { op: "seed",   data: [...] }        // only if empty
 *                      { op: "vote",   id, kind, delta }
 *                      { op: "add",    artist, song, moment, lang }
 *                      { op: "update", id, artist, song, moment, lang }
 *                      { op: "delete", id }
 * Every response is { ok: true, songs: [...] } so the client always ends up
 * holding exactly what the store holds.
 */

const KEY = "playlist";
const MAX = 10;

const store = () => getStore({ name: "playlist", consistency: "strong" });

const uid = () => Math.random().toString(36).slice(2, 12);
const clamp = n => Math.max(0, Math.min(MAX, parseInt(n, 10) || 0));
const clean = (v, max = 120) => String(v ?? "").trim().slice(0, max);

const shape = s => ({
  id: s.id || uid(),
  artist: clean(s.artist),
  song: clean(s.song),
  moment: clean(s.moment, 40),
  lang: clean(s.lang, 40),
  up: clamp(s.up),
  down: clamp(s.down)
});

async function read(s) {
  const rows = await s.get(KEY, { type: "json" });
  return Array.isArray(rows) ? rows.map(shape) : [];
}

function apply(rows, b) {
  switch (b.op) {
    case "seed":
      // Only ever populates an empty store, so a stray call can't wipe the list.
      return rows.length ? rows : (Array.isArray(b.data) ? b.data : []).map(shape);

    case "vote": {
      const r = rows.find(x => x.id === b.id);
      if (r) {
        const k = b.kind === "down" ? "down" : "up";
        r[k] = clamp(r[k] + (parseInt(b.delta, 10) || 0));
      }
      return rows;
    }

    case "add":
      if (!clean(b.artist) && !clean(b.song)) return rows;
      return rows.concat(shape({ ...b, up: 0, down: 0 }));

    case "update": {
      const r = rows.find(x => x.id === b.id);
      if (r) Object.assign(r, {
        artist: clean(b.artist), song: clean(b.song),
        moment: clean(b.moment, 40), lang: clean(b.lang, 40)
      });
      return rows;
    }

    case "delete":
      return rows.filter(x => x.id !== b.id);

    default:
      return rows;
  }
}

export default async req => {
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json", "cache-control": "no-store" }
    });

  if (req.method !== "POST") return json({ ok: false, error: "POST only" }, 405);

  let body;
  try { body = await req.json(); }
  catch { return json({ ok: false, error: "bad JSON" }, 400); }

  try {
    const s = store();
    let songs = await read(s);

    if (body.op && body.op !== "list") {
      // Blobs has no compare-and-set, so two writes landing in the same instant
      // could drop one. A short re-read and retry makes that vanishingly rare
      // at wedding scale; a lost vote is a tap, not a disaster.
      songs = apply(songs, body);
      await s.setJSON(KEY, songs);
      const after = await read(s);
      if (after.length !== songs.length) {
        await new Promise(r => setTimeout(r, 60 + Math.random() * 120));
        songs = apply(await read(s), body);
        await s.setJSON(KEY, songs);
      }
    }

    return json({ ok: true, songs });
  } catch (err) {
    return json({ ok: false, error: String(err?.message || err) }, 500);
  }
};

export const config = { path: "/api/playlist" };
