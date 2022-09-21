import { testDto } from './dto/test.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { exec, execSync, spawn, fork } from "child_process";
const fs = require('fs');
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, User} from './entities/test.entity';
import { randomUUID } from 'crypto';
const cypress = require('cypress');

@Injectable()
export class CypressService {
	constructor(
		@InjectModel('testlist') private readonly testModel: Model<Test>,
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
		return this.testModel.find({ 'tests.name': String}).exec();
	}

	async findTestByName(name: string, token : string): Promise<Test> {
		return await this.testModel.findOne({ token : token, 'tests.name' : name }).exec();
	}


	async deleteTestByName(name: string, token : string): Promise<Test> {
		return await this.testModel.findOneAndDelete({ token : token, 'tests.name' : name }).exec();
	}

	async createNewTest(testo: testDto[]) {
		const setTest = {
			name: randomUUID,
			test: testo
		}
		console.log("setTest =" , setTest)
		const newTest = new this.testModel(setTest);
		const result = await newTest.save();
		return result
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
