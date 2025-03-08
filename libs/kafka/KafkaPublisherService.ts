import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaPublisherService implements OnModuleInit {
  private kafka = new Kafka({
    clientId: 'materia-app',
    brokers: ['kafka:9092'], // Kafka service name in docker-compose
  });

  private producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
  }

  async sendMessage(topic: string, message: string) {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
  }
}
