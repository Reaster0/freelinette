import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Test {
	@PrimaryGeneratedColumn()
	id: number;


	@Column('text')
	action: string;

	@Column()
	element: {
		selector: string;
		path: string;
	}

	@Column()
	params: {
		name: string;
		value: string;
		valueExtend: {
			id: string;
			text: string;
		}
	}

}