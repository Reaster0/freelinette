import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CypressService } from './cypress/cypress.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, CypressService],
})
export class AppModule {}
