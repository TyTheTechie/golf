import { auth } from "@/auth";
import { sseManager } from "@/lib/sse-manager";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const connectionId = crypto.randomUUID();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      sseManager.addConnection(connectionId, controller, session.user.id);

      // Send initial connection confirmation
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ connectionId })}\n\n`)
      );

      // Heartbeat every 30s
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          clearInterval(heartbeat);
          sseManager.removeConnection(connectionId);
        }
      }, 30000);

      // Cleanup when client disconnects - use a polling approach since
      // AbortSignal isn't directly available in ReadableStream.start
      const cleanup = () => {
        clearInterval(heartbeat);
        sseManager.removeConnection(connectionId);
      };

      // Store cleanup for cancel
      (controller as unknown as { _cleanup: () => void })._cleanup = cleanup;
    },
    cancel(controller) {
      const ctrl = controller as unknown as { _cleanup?: () => void };
      ctrl._cleanup?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
