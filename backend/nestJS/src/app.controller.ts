import { CypressService } from './cypress/cypress.service';
import { testDto } from './cypress/dto/test.dto';
import { Controller, Get, Post, Body, ParseArrayPipe } from '@nestjs/common';

@Controller()
export class AppController {
	constructor(
		private readonly cypressService: CypressService) { }


	@Post('testExec')
	testExec(@Body(new ParseArrayPipe({ items: testDto, whitelist: true, forbidNonWhitelisted: true })) testDto: testDto[]): testDto[] {
		this.cypressService.createNewTest(testDto[0]);
		return testDto;
	}
	@Get('testExec')
	getALLTests(): any {
		return this.cypressService.findAll()
	}

	@Get('output')
	async getOutput(): Promise<string> {
		return await this.cypressService.testOutput();
	}

	@Get('launch')
	async launch(): Promise<string> {
		this.cypressService.launchTest();
		return await this.cypressService.testOutput();
	}

}
