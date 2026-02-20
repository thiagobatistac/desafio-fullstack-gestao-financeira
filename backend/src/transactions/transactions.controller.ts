import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post('transactions')
  create(@Body() dto: CreateTransactionDto, @Request() req) {
    return this.transactionsService.create(dto, req.user.userId);
  }

  @Get('transactions')
  findAll(@Query('month') month: string, @Query('year') year: string, @Request() req) {
    const m = parseInt(month) || new Date().getMonth() + 1;
    const y = parseInt(year) || new Date().getFullYear();
    return this.transactionsService.findByMonth(req.user.userId, m, y);
  }

  @Delete('transactions/:id')
  remove(@Param('id') id: string, @Request() req) {
    return this.transactionsService.remove(id, req.user.userId);
  }

  @Get('balance')
  getBalance(@Query('month') month: string, @Query('year') year: string, @Request() req) {
    const m = parseInt(month) || new Date().getMonth() + 1;
    const y = parseInt(year) || new Date().getFullYear();
    return this.transactionsService.getBalance(req.user.userId, m, y);
  }
}