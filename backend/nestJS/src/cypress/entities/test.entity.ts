import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Test extends Document {

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


export const TestSchema = SchemaFactory.createForClass(Test);