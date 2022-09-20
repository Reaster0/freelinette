import { testDto } from './dto/test.dto';
import { Injectable } from '@nestjs/common';
import { exec, execSync, spawn, fork } from "child_process";
const fs = require('fs');
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestStep } from './entities/test.entity';
const cypress = require('cypress');

@Injectable()
export class CypressService {
	constructor(
		@InjectModel('testlist') private readonly testModel: Model<Test>,
	) {} 

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

	findAll() {
		return this.testModel.find().exec();
	}

	async findOne(name: string): Promise<Test> {
		return await this.testModel.findOne({ name : name }).exec();
	}


	async deleteOne(name: string): Promise<Test> {
		return await this.testModel.findOneAndDelete({ name : name }).exec();
	}

	async createNewTest(testo: testDto[]) {
		const setTest = {
			name: "test name placeholder",
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
			browser: 'electron',
			config: {
				video: false,
			}
		})
		.then((res) => {
			console.log(res);
			return res;
		})
	}
}
