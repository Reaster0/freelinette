import { CypressService } from './cypress.service';
import { testBundleDto } from './dto/test.dto';
import { Headers ,Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus, Res } from '@nestjs/common';
import { Test } from './entities/test.entity';
import { execSync } from 'child_process';
const fs = require('fs');

@Controller('cypress')
export class CypressController {
	constructor(
		private readonly cypressService: CypressService) { }


	@Post('testList')
	async testList(
		@Headers('token') token: string,
		@Body() testDto: testBundleDto) {
			if (!await this.cypressService.userAuth(token))
				throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);

			return await this.cypressService.saveTest(testDto, token);
	}

	@Get('testList')
	async getALLTests(
		@Headers('token') token: string): Promise<Test[]> {
			if (!await this.cypressService.userAuth(token))
				throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
			
			return this.cypressService.findAllTests(token)
	}

	@Get('testList/:name')
	async getOutput(
		@Headers('token') token: string,
		@Param('name') name: string): Promise<any> {
			if (!await this.cypressService.userAuth(token))
				throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);

			return this.cypressService.findTestByName(name, token);
	}

	@Delete('testList/:name')
	async deleteTest(
		@Headers('token') token: string,
		@Param('name') name: string): Promise<any> {
			if (!await this.cypressService.userAuth(token))
				throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
			
			return this.cypressService.deleteTestByName(name, token);
	}

	@Get('launch/:name')
	async launch(
		@Headers('token') token: string,
		@Param('name') name: string): Promise<string> {
			if (!await this.cypressService.userAuth(token))
				throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
		
			const resTest = this.cypressService.launchTest(name, token);
			
			//blackmagic here because when you run multiple tests at the same time, another process spawn and is not usefull beside taking 1 core of cpu
			try {
				execSync('pkill -f "Cypress --gpu-preferences=WAAAA*"')
				console.log("Cypress zombie process killed");
			} catch(e){
				console.log("there was'nt any cypress zombie process running");
			}
			
			return resTest;
	}

	@Get('screen/:name')
	async getImage(
		@Headers('token') token: string,
		@Param('name') name: string,
		@Res() res) {
			if (!await this.cypressService.userAuth(token))
				throw new HttpException('Token Invalid', HttpStatus.FORBIDDEN);
			if (!fs.existsSync(`./cypress/screen/${token}.${name}.png`))
				throw new HttpException('Image not found', 404);
			res.sendFile(`${token}.${name}.png`, { root: './cypress/screen' });
	}
}
