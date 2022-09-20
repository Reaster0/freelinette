
import { Test } from './entities/test.entity';
import { CypressService } from './cypress.service';
import { testDto } from './dto/test.dto';
import { Controller, Get, Post, Body, ParseArrayPipe, Param, Delete } from '@nestjs/common';


@Controller('cypress')
export class CypressController {
	constructor(
		private readonly cypressService: CypressService) { }


	@Post('testList')
	async testExec(@Body(new ParseArrayPipe({ items: testDto, whitelist: true, forbidNonWhitelisted: true })) testDto: testDto[]) {
		return await this.cypressService.createNewTest(testDto);
	}
	@Get('testList')
	getALLTests(): any {
		return this.cypressService.findAll()
	}

	@Get('testList/:name')
	async getOutput(@Param() params): Promise<Test> {
		return this.cypressService.findOne(params.name);
	}

	@Delete('testList/:name')
	async deleteTest(@Param() params): Promise<Test> {
		return this.cypressService.deleteOne(params.name);
	}

	@Get('launch/:name')
	launch(@Param() params): string {
		return this.cypressService.launchTest(params.name);
		//return "testLaunched";
	}
}
