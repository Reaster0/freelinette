import { CypressService } from './cypress/cypress.service';
import { testDto } from './dto/test.dto';
import { Controller, Get, Post, Body, ParseArrayPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly cypressService: CypressService) { }

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}


	@Post('testExec')
	testExec(@Body(new ParseArrayPipe({ items: testDto, whitelist: true, forbidNonWhitelisted: true })) testDto: testDto[]): testDto[] {
		return testDto;
	}

	@Get('launch')
	async launch(): Promise<void> {
		return this.cypressService.launchTest();
	}

}
