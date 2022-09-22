import { CypressService } from './cypress.service';
import { testDto } from './dto/test.dto';
import { Controller, Get, Post, Body, ParseArrayPipe, Param, Delete, UseGuards, Query, HttpException, HttpStatus } from '@nestjs/common';


@Controller('cypress')
export class CypressController {
	constructor(
		private readonly cypressService: CypressService) { }


	@Post('testList')
	async testExec(
		@Query('token') token: string,
		@Body(new ParseArrayPipe({ items: testDto, whitelist: true, forbidNonWhitelisted: true })) testDto: testDto[]) {
			if (!await this.cypressService.userAuth(token))
				throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);

			return await this.cypressService.createNewTest(testDto, token);
	}

	@Get('testList')
	async getALLTests(
		@Query('token') token : string): Promise<any> {
			if (!await this.cypressService.userAuth(token))
				throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
			
			return this.cypressService.findAllTests()
	}

	// @Get('testList/:name')
	// async getOutput(
	// 	@Query('token') token: string,
	// 	@Param('name') name: string): Promise<Test> {
	// 		if (!await this.cypressService.userAuth(token))
	// 			throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);

	// 		return this.cypressService.findTestByName(name, token);
	// }

	// @Delete('testList/:name')
	// async deleteTest(
	// 	@Query('token') token: string,
	// 	@Param('name') name: string): Promise<Test> {
	// 		if (!await this.cypressService.userAuth(token))
	// 			throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
		
	// 		return this.cypressService.deleteTestByName(name, token);
	// }

	@Get('launch/:name')
	async launch(
		@Query('token') token: string,
		@Param('name') name: string): Promise<string> {
			if (!await this.cypressService.userAuth(token))
				throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
		
			return this.cypressService.launchTest(name);
	}
}
