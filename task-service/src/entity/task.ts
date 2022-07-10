import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "Task name" })
    name: Text

    @Column({ default: 5 })
    timeLimit: number

    @Column({ default: 128 })
    memoryLimit: number

    @Column()
    content: Text;

    @Column({ type: "integer", default: null, nullable: true })
    competitionId: number | null;

    @Column()
    authorId: number;
}