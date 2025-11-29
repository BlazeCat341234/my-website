// functions/orders.js
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // GET /orders
  if (request.method === "GET" && url.pathname === "/orders") {
    const result = await env.DB.prepare("SELECT * FROM orders").all();
    return new Response(JSON.stringify(result.results), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // POST /orders
  if (request.method === "POST" && url.pathname === "/orders") {
    const data = await request.json();
    const { Name, Email, Price, Description, Status, Action } = data;

    const result = await env.DB.prepare(
      `INSERT INTO orders (Name, Email, Price, Description, Status, Action)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(Name, Email, Price, Description, Status || 'current', Action || '')
    .run();

    return new Response(JSON.stringify({ id: result.lastInsertId }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response("Not found", { status: 404 });
}
