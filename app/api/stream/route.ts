export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const messages = ["Salut ", "din ", "backend ", "streaming"];

      for (const msg of messages) {
        controller.enqueue(encoder.encode(msg));
        await new Promise((r) => setTimeout(r, 400));
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
