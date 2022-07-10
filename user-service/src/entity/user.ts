import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    isAdmin: boolean;

    @Column()
    username: string;

    @Column()
    password: string;
}