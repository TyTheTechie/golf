interface Connection {
  id: string;
  controller: ReadableStreamDefaultController;
  userId?: string;
}

class SSEManager {
  private connections: Map<string, Connection> = new Map();

  addConnection(
    id: string,
    controller: ReadableStreamDefaultController,
    userId?: string
  ) {
    this.connections.set(id, { id, controller, userId });
  }

  removeConnection(id: string) {
    this.connections.delete(id);
  }

  broadcast(event: string, data: unknown) {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    const encoder = new TextEncoder();
    const encoded = encoder.encode(message);

    for (const [id, conn] of this.connections) {
      try {
        conn.controller.enqueue(encoded);
      } catch {
        this.connections.delete(id);
      }
    }
  }

  notifyUser(userId: string, event: string, data: unknown) {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    const encoder = new TextEncoder();
    const encoded = encoder.encode(message);

    for (const [id, conn] of this.connections) {
      if (conn.userId === userId) {
        try {
          conn.controller.enqueue(encoded);
        } catch {
          this.connections.delete(id);
        }
      }
    }
  }

  get connectionCount() {
    return this.connections.size;
  }
}

const globalForSSE = globalThis as unknown as {
  sseManager: SSEManager | undefined;
};

export const sseManager =
  globalForSSE.sseManager ?? new SSEManager();

if (process.env.NODE_ENV !== "production") globalForSSE.sseManager = sseManager;
