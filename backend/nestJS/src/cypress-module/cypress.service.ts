import { testDto } from './dto/test.dto';
import { Injectable } from '@nestjs/common';
import { exec, execSync, spawn, fork } from "child_process";
const fs = require('fs');
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test } from './entities/test.entity';
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

	findOne(id: string) {
		const test = this.testModel.findOne({ id: id }).exec();
		return test;
	}

	async createNewTest(testo: testDto[]) {
		const setTest = {
			name: "test ID",
			test: testo
		}
		console.log("mdr =" , setTest)
		const newTest = new this.testModel(setTest);
		const result = await newTest.save();
		return result
	}
	

	launchTest(): string {
		return cypress.run({
			spec: './cypress/e2e/1234-test.cy.js',
			reporter: 'junit',
			browser: 'electron',
			config: {
				video: false,
			}
		})
		.then((res) => {
			console.log(res);
			return "mdr";
		})
	}
}
