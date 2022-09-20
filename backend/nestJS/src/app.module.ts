import { CypressModule } from './cypress-module/cypress.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
	MongooseModule.forRoot(`mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`),
	CypressModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}