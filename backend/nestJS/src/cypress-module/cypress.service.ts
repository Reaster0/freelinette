import { arrayTestDto2Test, testDto} from './dto/test.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { exec, execSync, spawn, fork } from "child_process";
const fs = require('fs');
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Test, User } from './entities/test.entity';
import { randomUUID } from 'crypto';
const cypress = require('cypress');
import { srlNewStep, srlInit, srlEnd } from './serializer';

@Injectable()
export class CypressService {
	constructor(
		//@InjectModel('testlist') private readonly testModel: Model<Test>,
		@InjectModel('testlist') private readonly userModel: Model<User>,	
	) {}

	async userAuth(token: string): Promise<Boolean> {
		return await this.userModel.findOne({id : token}).exec()? true : false;
	}

	async findAllTests(token : string) {
		return (await this.findUserById(token)).tests;
	}

	async findTestByName(name: string, token : string): Promise<any> {
		const user = await this.findUserById(token);
		return user.tests.find((test) => test.name === name);
	}

	async findUserById(id: string): Promise<User> {
		return await this.userModel.findOne({id : id}).exec();
	}

	async deleteTestByName(name: string, token : string) {
		const user = await this.findUserById(token);
		return await user.update({$pull: {tests: {name: name}}}).exec();
	}

	async createNewTest(testo: testDto[], token: string): Promise<User> {
		const user = await this.findUserById(token);
		user.tests.push({name: "anome", test: arrayTestDto2Test(testo)});
		return user.save();
	}
	

	launchTest(name: string): string {
		return cypress.run({
			spec: `./cypress/e2e/${name}.cy.js`,
			screeshot: true,
			quiet: true,
			browser: 'chrome',
			config: {
				video: false,
			}
		})
		.then((res) => {
			//console.log(res);
			return res;
		})
	}

	serializer(tests: testDto[]) : string {
		let result = srlInit("osef", "http://172.17.0.1:5501/demo-form.html");

		tests.forEach((test) => {
				result += srlNewStep(test)
		})

		result += srlEnd();

		try {
			fs.writeFileSync(`./cypress/e2e/${randomUUID()}.cy.js`, result);
		}
		catch (err) {
			console.log(err);
			throw new HttpException("Error while writing testFile", 500);
		}

		return result;
	}


	// async testOutput(): Promise<string> {
	// 	let result: string;
	// 	try {
	// 	result = fs.readFileSync('../cypress-runtime/output.txt', 'utf8');
	// 	} catch (e) {
	// 		result = "error reading result file";
	// 		console.log(e)
	// 	}
	// 	return result;
	// }
}
