import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CypressService } from './cypress.service';
import { UserSchema } from './entities/test.entity';
import { CypressController } from './cypress.controller';
import { User } from './entities/test.entity';


@Module({
	imports: [
		// HttpModule.register({
		// 	// baseURL: 'http://cgi-express',
		// 	timeout: 5000,
		// 	maxRedirects: 5,
		// }),
		// MongooseModule.forFeature([
		// 	{
		// 		name: 'testlist',
		// 		schema: TestSchema,
		// 	}
		// ]),
		MongooseModule.forFeature([
			{
				name: 'testlist',
				schema: UserSchema,
			}
		]),
	],
	exports: [CypressService],
	providers: [CypressService],
	controllers: [CypressController]
})
export class CypressModule {}
