import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Competition {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    author: number;

    @Column({ default: "Competition name" })
    name: string;
}