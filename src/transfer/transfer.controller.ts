import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async create(@Body() createTransferDto: CreateTransferDto) {
    return this.transferService.createTransfer(createTransferDto);
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.transferService.findByCode(code);
  }

  @Get()
  findAll() {
    return this.transferService.findAll();
  }

  @Get('balance/:account')
  getBalance(@Param('account') account: string) {
    const balance = this.transferService.getBalance(account);
    if (balance === undefined) {
      return { error: 'Account not found' };
    }
    return { account, balance };
  }
}