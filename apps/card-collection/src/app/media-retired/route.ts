export function GET() {
  return new Response("This media is no longer distributed.", {
    status: 410,
    headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" },
  });
}
