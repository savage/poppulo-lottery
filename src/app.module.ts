import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from 'ormconfig';
import { DataSource } from 'typeorm';
import { TicketModule } from './ticket/ticket.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TicketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
