import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from 'class-transformer';
import { Ticket } from "./ticket.entity";

@Entity()
export class Line {
    @PrimaryGeneratedColumn()
    @Exclude({ toPlainOnly: true })
    id: number;

    @ManyToOne(() => Ticket, (ticket) => ticket.lines)
    @Exclude({ toPlainOnly: true })
    ticket: Ticket;

    @Column()
    numbers: string;

    value?: number;
}