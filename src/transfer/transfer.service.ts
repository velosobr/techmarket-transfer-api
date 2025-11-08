import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { Transfer } from './transfer.entity';

@Injectable()
export class TransferService {
  private accounts = new Map<string, number>([
    ['123456', 10000],
    ['654321', 5000],
    ['111111', 15000],
    ['222222', 8000],
  ]);

  private transactions: Transfer[] = [];

  async createTransfer(dto: CreateTransferDto): Promise<any> {
    const { from, to, amount } = dto;

    if (from === to) {
      throw new BadRequestException('Origin and destination accounts cannot be the same');
    }

    if (!this.accounts.has(from)) {
      throw new BadRequestException(`Account ${from} not found`);
    }

    if (!this.accounts.has(to)) {
      throw new BadRequestException(`Account ${to} not found`);
    }

    const balance = this.accounts.get(from)!;
    if (balance < amount) {
      throw new BadRequestException(
        `Insufficient balance. Available: R$ ${balance.toFixed(2)}`,
      );
    }

    this.accounts.set(from, balance - amount);
    this.accounts.set(to, this.accounts.get(to)! + amount);

    const code = uuidv4();

    const transaction: Transfer = {
      code,
      from,
      to,
      amount,
      timestamp: new Date(),
      status: 'completed',
    };

    this.transactions.push(transaction);

    return {
      code,
      status: 'success',
      message: 'Transfer completed successfully',
      from,
      to,
      amount,
      newBalance: this.accounts.get(from),
      timestamp: transaction.timestamp,
    };
  }

  findByCode(code: string): Transfer | undefined {
    return this.transactions.find((t) => t.code === code);
  }

  findAll(): Transfer[] {
    return this.transactions;
  }

  getBalance(account: string): number | undefined {
    return this.accounts.get(account);
  }
}