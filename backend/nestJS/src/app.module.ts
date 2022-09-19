import { CypressModule } from './cypress-module/cypress.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
	MongooseModule.forRoot('mongodb://db:27017/mongo'),
	CypressModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}