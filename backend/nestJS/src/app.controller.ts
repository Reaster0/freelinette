import { CypressService } from './cypress/cypress.service';
import { testDto } from './cypress/dto/test.dto';
import { Controller, Get, Post, Body, ParseArrayPipe } from '@nestjs/common';

@Controller()
export class AppController {
	constructor(
		private readonly cypressService: CypressService) { }


	@Post('testList')
	testExec(@Body(new ParseArrayPipe({ items: testDto, whitelist: true, forbidNonWhitelisted: true })) testDto: testDto[]): testDto[] {
		this.cypressService.createNewTest(testDto);
		return testDto;
	}
	@Get('testList')
	getALLTests(): any {
		return this.cypressService.findAll()
	}

	@Get('output')
	async getOutput(): Promise<string> {
		return await this.cypressService.testOutput();
	}

	@Get('launch')
	launch(): string {
		this.cypressService.launchTest();
		return "testLaunched";
		//return await this.cypressService.testOutput();
	}

}
