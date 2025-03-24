// src/shared/messaging/RabbitMQService.ts
import amqp, { Connection, Channel } from "amqplib";

const rabbitSettings = {
  protocol: "amqp",
  hostname: "host.docker.internal",
  port: 5672,
  username: "vac",
  password: "vac",
  vhost: "/",
  authMechanism: ["PLAIN", "AMQPLAIN", "EXTERNAL"],
};

const queues = ["emailQueue"];

export class RabbitMQService {
  private static instance: RabbitMQService;
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  private constructor() {}

  static getInstance(): RabbitMQService {
    if (!RabbitMQService.instance) {
      RabbitMQService.instance = new RabbitMQService();
    }
    return RabbitMQService.instance;
  }

  async init(): Promise<void> {
    if (this.connection) return;

    try {
      this.connection = (await amqp.connect(rabbitSettings)) as unknown as Connection;
      this.channel = (await (this.connection as any).createChannel()) as unknown as Channel;

      for (const queue of queues) {
        await this.channel.assertQueue(queue, { durable: true });
      }

      console.log("RabbitMQ conectado correctamente.");
    } catch (error) {
      console.error("Error al conectar con RabbitMQ:", error);
      throw error;
    }
  }

  getChannel(): Channel {
    if (!this.channel) {
      throw new Error("El canal RabbitMQ no está inicializado.");
    }
    return this.channel;
  }

  async publish(queue: string, message: any): Promise<void> {
    const channel = this.getChannel();
    const buffer = Buffer.from(JSON.stringify(message));
    channel.sendToQueue(queue, buffer, { persistent: true });
  }

  async consume(queue: string, consumerCallback: (msg: any) => void): Promise<void> {
    const channel = this.getChannel();
    await channel.consume(queue, (msg) => {
      if (msg) {
        const message = JSON.parse(msg.content.toString());
        consumerCallback(message);
        channel.ack(msg);
      }
    });
  }
}
