import { testBundleDto, testBundleDto2Test} from './dto/test.dto';
import { HttpException, Injectable } from '@nestjs/common';
const fs = require('fs');
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Test, User } from './entities/test.entity';
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

	async createNewTest(testo: testBundleDto, token: string): Promise<User> {
		const user = await this.findUserById(token);
		user.tests.push(testBundleDto2Test(testo));
		return user.save();
	}
	

	async launchTest(name: string, token : string): Promise<any> {
		const testFind = await this.findTestByName(name, token);
		if (!testFind)
			throw new HttpException('Test not found', 404);
		this.serializer(testFind);

		return cypress.run({
			spec: `./cypress/e2e/${name}.cy.js`,
			screeshot: true,
			quiet: true,
			browser: 'chrome',
			config: {
				video: false,
			},
			
		})
		.then((res) => {
			this.cleanupSerialize(name);
			try{
				fs.renameSync(`./cypress/screenshots/${name}.cy.js/Cypress test -- ${name} (failed).png`, `./cypress/screen/${token}.${name}.png`);}
			catch {console.log("no Screenshots");}

			return {
				status: res.totalFailed === 0 ? "success" : "failed",
				totalTests: res.totalTests,
				totalFailed: res.totalFailed,
				totalPassed: res.totalPassed,
				startedAt: res.startedAt,
				finishedAt: res.finishedAt,
				duration: res.duration,
			}
			return res;
		})

	}

	serializer(testInput: Test) : string {
		let result = srlInit(testInput.name, testInput.website);
		testInput.test.forEach((test) => {
				result += srlNewStep(test)
		})
		result += srlEnd();

		try {
			fs.writeFileSync(`./cypress/e2e/${testInput.name}.cy.js`, result);
		}
		catch (err) {
			console.log(err);
			throw new HttpException("Error while writing testFile", 500);
		}

		return result;
	}

	cleanupSerialize(name: string) {
		try{
			fs.unlinkSync(`./cypress/e2e/${name}.cy.js`);
		}
		catch (err) {
			console.log(err);
			throw new HttpException("Error while deleting testFile", 500);
		}
	}
}
