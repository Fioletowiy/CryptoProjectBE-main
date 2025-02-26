import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'https://ezpromo.app'], // Укажите ваш фронтенд источник
    credentials: true,
  },
})
export class PromoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients: Map<string, Socket> = new Map();

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected');
    const clientId = client.handshake.auth.clientId;
    if (clientId) {
      this.clients.set(clientId, client);
      client.on('disconnect', () => {
        console.log(`Client disconnected: ${clientId}`);
        this.clients.delete(clientId);
      });
      client.on('error', (error) => {
        console.error(`Client error: ${clientId}`, error);
      });
    } else {
      console.error('Client connected without clientId');
    }
  }

  handleDisconnect(client: Socket) {
    const clientId = Array.from(this.clients.entries()).find(
      ([, value]) => value === client,
    )?.[0];
    if (clientId) {
      console.log(`Client disconnected: ${clientId}`);
      this.clients.delete(clientId);
    } else {
      console.error('Client disconnected without clientId');
    }
  }

  sendMessageToClient(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (client) {
      client.emit('message', message);
    } else {
      console.error(`Client with clientId ${clientId} not found`);
    }
  }
}
