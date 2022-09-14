import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CypressService } from './cypress/cypress.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
	TypeOrmModule.forRootAsync({
		useFactory: () => ({
		  type: 'postgres',
		  host: process.env.DATABASE_HOST,
		  port: +process.env.DATABASE_PORT,
		  username: process.env.DATABASE_USER,
		  password: process.env.DATABASE_PASSWORD,
		  database: process.env.DATABASE_NAME,
		  autoLoadEntities: true, //Load automatically entities without specifying the array
		  synchronize: true, // Synch DB with entities each time we load the app
		}),
	  }),
  ],
  controllers: [AppController],
  providers: [AppService, CypressService],
})
export class AppModule {}
