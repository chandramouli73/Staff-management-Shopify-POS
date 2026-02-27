// 

// app/routes/api.pos-search.jsx

// export async function action({ request }) {
//   return new Response(
//     JSON.stringify({ ok: true, message: "Proxy works" }),
//     { headers: { "Content-Type": "application/json" } }
//   );
// }

// export async function loader() {
//   return new Response(
//     JSON.stringify({ ok: true, method: "GET works" }),
//     { headers: { "Content-Type": "application/json" } }
//   );
// }

import shopify from "../shopify.server";

export async function loader() {
  return new Response(
    JSON.stringify({ ok: true, message: "GET works" }),
    { headers: { "Content-Type": "application/json" } }
  );
}

export async function action({ request }) {
  try {
    console.log("🔥 ACTION HIT");

    const { admin } = await shopify.authenticate(request);

    let body = {};
    try {
      body = await request.json();
    } catch {
      const text = await request.text();
      body = Object.fromEntries(new URLSearchParams(text));
    }

    return new Response(
      JSON.stringify({ ok: true, body }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("CRASH:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}