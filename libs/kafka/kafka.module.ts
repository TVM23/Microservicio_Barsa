import { Module } from '@nestjs/common';
import { KafkaPublisherService } from './KafkaPublisherService';

@Module({
  providers: [KafkaPublisherService],
  exports: [KafkaPublisherService], 
})
export class KafkaModule {}