import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CypressService } from './cypress.service';
import { Test } from './entities/test.entity';


@Module({
	imports: [
		TypeOrmModule.forFeature([Test])
	],
	exports: [CypressService],
	providers: [CypressService]
})
export class CypressModule {}
