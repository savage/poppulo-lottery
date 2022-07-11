import { Exclude } from "class-transformer";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Line } from './line.entity';

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Line, (line) => line.ticket, { cascade: ['insert'] })
    lines: Line[];

    @Column({ default: false })
    @Exclude({ toPlainOnly: true })
    checked: boolean;

    totalValue?: number;
}