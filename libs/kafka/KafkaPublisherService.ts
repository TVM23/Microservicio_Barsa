import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaPublisherService implements OnModuleInit {
  private kafka = new Kafka({
    clientId: 'materia-app',
    brokers: ['kafka:9092'], // Kafka service name in docker-compose
    connectionTimeout:20000,
    requestTimeout:30000
  });

  private producer = this.kafka.producer();
  private consumer = this.kafka.consumer({ groupId: 'materia-response-group' });
  private responses = new Map<string, (data: any) => void>(); // Store promises for responses

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({
      topics: [
        'materia-response', 'materia-pagination-response', 'materia-codigo-response',
        'papeleta-response', 'papeleta-pagination-response', 'papeleta-codigo-response',
      ],
      fromBeginning: true,
    });

    // Run the consumer ONCE and listen for responses
    await this.consumer.run({
      // eslint-disable-next-line @typescript-eslint/require-await
      eachMessage: async ({ topic, message }) => {
        const messageValue = message.value?.toString() ?? "{}";
        try {
          const response = JSON.parse(messageValue);
          const { correlationId, data } = response;
          if (this.responses.has(correlationId)) {
            this.responses.get(correlationId)!(data);
            this.responses.delete(correlationId);
          }
        } catch (error) {
          console.error("Error parsing Kafka message:", error);
        }
      },
    });

    // Mantener la conexión viva con un "ping" cada 30s
    setInterval(async () => {
      await this.producer.send({
        topic: 'health-check',
        messages: [{ value: JSON.stringify({ timestamp: Date.now() }) }],
      });
    }, 30000);
  }

  private async ensureConnected() {
    if (!this.producer) {
      this.producer = this.kafka.producer();
      await this.producer.connect();
    }
    if (!this.consumer) {
      this.consumer = this.kafka.consumer({
        groupId: 'materia-response-group',
        sessionTimeout: 60000,  // 1 min antes de que Kafka cierre el consumer
        heartbeatInterval: 15000, // Heartbeat cada 15s
      });
      await this.consumer.connect();
    }
  }

  public async sendRequest<T>(topic: string, payload: T): Promise<any> {
    await this.ensureConnected();
    const correlationId = Math.random().toString(36).substring(7);

    return new Promise(async (resolve, reject) => {
      this.responses.set(correlationId, resolve); // Store resolver

      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify({ correlationId, data: payload }) }],
      });

      // Timeout to prevent waiting forever
      setTimeout(() => {
        if (this.responses.has(correlationId)) {
          this.responses.delete(correlationId);
          reject(new Error(`Timeout waiting for response on topic: ${topic}`));
        }
      }, 40000);
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  /*async sendMessage(topic: string, message: string) {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
  }

  public async sendMateriaPagination(topic: string, dto: MateriaPaginationDto): Promise<any> {
    return this.sendRequest(topic, dto);
  }

  public async sendMessageResponse(topic: string, message: string): Promise<any> {
    return this.sendRequest(topic, message);
  }*/

}

