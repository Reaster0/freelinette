import { testDto } from './dto/test.dto';
import { Injectable } from '@nestjs/common';
import { exec, execSync, spawn, fork } from "child_process";
const fs = require('fs');
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test } from './entities/test.entity';
const cypress = require('cypress');

@Injectable()
export class CypressService {
	constructor(
		@InjectModel(Test.name) private readonly testModel: Model<Test>,	
		private readonly httpService: HttpService,
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

	createNewTest(testo: testDto[]) {
		const mdr = {
			name: "test ID",
			test: testo
		}
		console.log("mdr =" , mdr)
		const newTest = new this.testModel(mdr);
		newTest.save();
	}
	

	launchTest(): string {
		return cypress.run({
			spec: './cypress/e2e/1234-test.cy.js',
			reporter: 'junit',
			browser: 'electron',
			config: {
				video: true,
			}
		})
		.then((res) => {
			console.log(res);
			return "mdr";
		})
	}
}
