/**
 * A function with no imports and nothing to go wrong. Its only job is to prove
 * whether functions run on this deploy at all.
 *
 *   /api/ping  ->  {"ok":true,"ping":"alive","node":"v..."}   functions work
 *   502 or 404 ->  the deploy itself is the problem, not storage
 */
export default async () =>
  new Response(
    JSON.stringify({ ok: true, ping: "alive", node: process.version }),
    { headers: { "content-type": "application/json", "cache-control": "no-store" } }
  );

export const config = { path: "/api/ping" };
