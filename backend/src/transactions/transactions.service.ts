import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from './transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(
    dto: CreateTransactionDto,
    userId: string,
  ): Promise<TransactionDocument> {
    const transaction = new this.transactionModel({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
    return transaction.save();
  }

  async findByMonth(
    userId: string,
    month: number,
    year: number,
  ): Promise<TransactionDocument[]> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const regular = await this.transactionModel.find({
      userId: new Types.ObjectId(userId),
      type: { $in: ['income', 'expense'] },
      date: { $gte: start, $lte: end },
    });

    const fixed = await this.transactionModel.find({
      userId: new Types.ObjectId(userId),
      type: 'fixed-expense',
    });

    return [...regular, ...fixed];
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.transactionModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });

    if (!result) {
      throw new NotFoundException('Transação não encontrada');
    }
  }

  async getBalance(
    userId: string,
    month: number,
    year: number,
  ): Promise<{ income: number; expense: number; balance: number }> {
    const transactions = await this.findByMonth(userId, month, year);

    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === 'expense' || t.type === 'fixed-expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }
}