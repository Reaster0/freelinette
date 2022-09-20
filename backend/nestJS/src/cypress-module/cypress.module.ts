import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CypressService } from './cypress.service';
import { Test, TestSchema } from './entities/test.entity';
//import { HttpModule } from '@nestjs/axios';
import { CypressController } from './cypress.controller';


@Module({
	imports: [
		// HttpModule.register({
		// 	// baseURL: 'http://cgi-express',
		// 	timeout: 5000,
		// 	maxRedirects: 5,
		// }),
		MongooseModule.forFeature([
			{
				name: 'testlist',
				//name: Test.name,
				schema: TestSchema,
			}
		])
	],
	exports: [CypressService],
	providers: [CypressService],
	controllers: [CypressController]
})
export class CypressModule {}
