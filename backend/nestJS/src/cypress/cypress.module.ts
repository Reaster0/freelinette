import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CypressService } from './cypress.service';
import { Test, TestSchema } from './entities/test.entity';


@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Test.name,
				schema: TestSchema,
			}
		])
	],
	exports: [CypressService],
	providers: [CypressService]
})
export class CypressModule {}
