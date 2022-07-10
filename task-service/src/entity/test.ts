import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Test {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    expectedValue: string;

    @Column()
    inputValue: string;

    @Column()
    taskId: number;
}