import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { testDto } from '../dto/test.dto';

@Schema()
export class TestStep extends Document {

	@Prop(String)
	action: string;

	@Prop({type: {selector: String, path: String}})
	element: {
		selector: string;
		path: string;
	}

	@Prop({ type: {name: String, value: String, valueExtend: {id: String, text: String}}})
	params: {
		name: string;
		value: string;
		valueExtend: {
			id: string;
			text: string;
		}
	}

}

@Schema()
export class Test extends Document {

	@Prop(String)
	name: string;

	@Prop([TestStep])
	test: TestStep[];
}


@Schema()
export class User extends Document {
	@Prop({type: String, required: true, index: true})
	id: string;

	@Prop([Test])
	tests: Test[];
}

export const TestSchema = SchemaFactory.createForClass(Test);
export const UserSchema = SchemaFactory.createForClass(User);