import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Receipt, getPointsResponse, processReceiptResponse } from './interfaces';
import { ReceiptDto } from './receipt.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/receipts/:id/points')
  async getPoints(@Param('id') id): Promise<getPointsResponse> {
    const points = await this.appService.getPoints(id);
    return { points }
  }

  @Post('/receipts/process')
  async createMessage(
    @Body() receipt: ReceiptDto
  ): Promise<processReceiptResponse> {
    const id = await this.appService.processReceipt(receipt)
    return { id };
  }
}
