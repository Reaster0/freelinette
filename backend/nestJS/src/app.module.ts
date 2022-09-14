import { CypressModule } from './cypress/cypress.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { CypressService } from './cypress/cypress.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
	MongooseModule.forRoot('mongodb://db:27017/mongo'),
	CypressModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
