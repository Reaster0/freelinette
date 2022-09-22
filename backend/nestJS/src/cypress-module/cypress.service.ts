import { arrayTestDto2Test, testDto} from './dto/test.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { exec, execSync, spawn, fork } from "child_process";
const fs = require('fs');
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Test, User } from './entities/test.entity';
import { randomUUID } from 'crypto';
const cypress = require('cypress');

@Injectable()
export class CypressService {
	constructor(
		//@InjectModel('testlist') private readonly testModel: Model<Test>,
		@InjectModel('testlist') private readonly userModel: Model<User>,	
	) {}

	async userAuth(token: string): Promise<Boolean> {
		return await this.userModel.findOne({id : token}).exec()? true : false;
	}

	async testOutput(): Promise<string> {
		let result: string;
		try {
		result = fs.readFileSync('../cypress-runtime/output.txt', 'utf8');
		} catch (e) {
			result = "error reading result file";
			console.log(e)
		}
		return result;
	}

	findAllTests() {
		//return this.testModel.find({ 'tests.name': String}).exec();
	}

	async findTestByName(name: string, token : string) {
		//return await this.testModel.findOne({ token : token, 'tests.name' : name }).exec();
	}

	async findUserById(id: string): Promise<User> {
		return await this.userModel.findOne({id : id}).exec();
	}


	async deleteTestByName(name: string, token : string) {
		//return await this.userModel.findOneAndDelete({ id : token, 'tests.name' : name }).exec();
	}

	async createNewTest(testo: testDto[], token: string): Promise<User> {
		const user = await this.findUserById(token);
		user.tests.push({name: randomUUID(), test: arrayTestDto2Test(testo)});
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
}
