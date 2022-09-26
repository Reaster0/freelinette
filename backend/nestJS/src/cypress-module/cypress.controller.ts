import { TestStep } from './entities/test.entity';
import { CypressService } from './cypress.service';
import { testDto, testBundleDto } from './dto/test.dto';
import { Controller, Get, Post, Body, ParseArrayPipe, Param, Delete, UseGuards, Query, HttpException, HttpStatus, ValidationPipe, Res } from '@nestjs/common';
import { Test } from './entities/test.entity';
const fs = require('fs');

@Controller('cypress')
export class CypressController {
	constructor(
		private readonly cypressService: CypressService) { }


	@Post('testList')
	async testList(
		@Query('token') token: string,
		@Body() testDto: testBundleDto) {
			if (!await this.cypressService.userAuth(token))
				throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);

			return await this.cypressService.createNewTest(testDto, token);
	}

	// @Post('serializer/:name')
	// async serializer(
	// 	@Query('token') token: string,
	// 	@Param('name') name: string) {
	// 		if (!await this.cypressService.userAuth(token))
	// 			throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
	// 		const testFind = await this.cypressService.findTestByName(name, token);
	// 		if (!testFind)
	// 			throw new HttpException('Test not found', 404);
	// 		return this.cypressService.serializer(testFind);		
	// }

	@Get('testList')
	async getALLTests(
		@Query('token') token : string): Promise<Test[]> {
			if (!await this.cypressService.userAuth(token))
				throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
			
			return this.cypressService.findAllTests(token)
	}

	@Get('testList/:name')
	async getOutput(
		@Query('token') token: string,
		@Param('name') name: string): Promise<any> {
			if (!await this.cypressService.userAuth(token))
				throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);

			return this.cypressService.findTestByName(name, token);
	}

	@Delete('testList/:name')
	async deleteTest(
		@Query('token') token: string,
		@Param('name') name: string): Promise<any> {
			if (!await this.cypressService.userAuth(token))
				throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
			
			return this.cypressService.deleteTestByName(name, token);
	}

	@Get('launch/:name')
	async launch(
		@Query('token') token: string,
		@Param('name') name: string): Promise<string> {
			if (!await this.cypressService.userAuth(token))
				throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
		
			return this.cypressService.launchTest(name, token);
	}

	@Get('screen/:name')
	async getImage(
		@Query('token') token: string,
		@Param('name') name: string,
		@Res() res) {
			if (!await this.cypressService.userAuth(token))
				throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
			if (!fs.existsSync(`./cypress/screen/${token}.${name}.png`))
				throw new HttpException('Image not found', 404);
			res.sendFile(`${token}.${name}.png`, { root: './cypress/screen' });
	}
}
