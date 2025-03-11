import { MateriaPaginationDto } from '@app/contracts';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaPublisherService implements OnModuleInit {
  private kafka = new Kafka({
    clientId: 'materia-app',
    brokers: ['kafka:9092'], // Kafka service name in docker-compose
  });

  private producer = this.kafka.producer();
  private consumer = this.kafka.consumer({ groupId: 'materia-response-group' });

  private responses = new Map<string, (data: any) => void>(); // Store promises for responses

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'materia-response', fromBeginning: true });
    await this.consumer.subscribe({ topic: 'materia-pagination-response', fromBeginning: true });


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
  }

  async sendMessage(topic: string, message: string) {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
  }

  async sendMessageAndWait(topic: string, message: string): Promise<any> {
    const correlationId = Math.random().toString(36).substring(7);

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      this.responses.set(correlationId, resolve); // Store the resolver

      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify({ correlationId, message }) }],
      });

      // Timeout to prevent waiting forever
      setTimeout(() => {
        if (this.responses.has(correlationId)) {
          this.responses.delete(correlationId);
          reject(new Error('Timeout waiting for response'));
        }
      }, 30000);
    });
  }

  async sendMateriaPagination(topic: string, dto: MateriaPaginationDto): Promise<any> {
    const correlationId = Math.random().toString(36).substring(7);
  
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      this.responses.set(correlationId, resolve); // Store resolver for response

      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify({ correlationId, data: dto }) }],
      });
  
      // Timeout to prevent waiting forever
      setTimeout(() => {
        if (this.responses.has(correlationId)) {
          this.responses.delete(correlationId);
          reject(new Error("Timeout waiting for response"));
        }
      }, 30000);
    });
  }  

}

