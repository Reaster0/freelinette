import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CypressService } from './cypress.service';
import { UserSchema } from './entities/test.entity';
import { CypressController } from './cypress.controller';

@Module({
	imports: [
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
