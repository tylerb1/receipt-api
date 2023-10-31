import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'date-fns';
import { Item, Receipt } from './interfaces';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getPoints(id: string): Promise<number> {
    let rec: Receipt = await this.cacheManager.get(id);
    if (!rec) {
      throw new NotFoundException('No receipt found for that id');
    }

    let totalPoints = 0;
    
    const alphaNumericRetailerLength = rec.retailer.replace(/[^a-zA-Z0-9]/g, '').length;
    
    const roundDollarBonus = (parseFloat(rec.total) * 100) % 100 === 0 ? 50 : 0;
    
    const roundQuarterBonus = (parseFloat(rec.total) * 100) % 25 === 0 ? 25 : 0;
    
    const everyTwoItemsBonus = Math.floor(rec.items.length / 2) * 5;
    
    const trimmedLengthBonus = rec.items.reduce((total: number, currentItem: Item) => {
      const itemScore = currentItem.shortDescription.trim().length % 3 === 0 
        ? Math.ceil(parseFloat(currentItem.price) * 0.2) 
        : 0;
      return total + itemScore;
    }, 0);
    
    const oddDateBonus = parse(
      rec.purchaseDate, 'yyyy-mm-dd', new Date()
    ).getDate() % 2 === 1 
      ? 6 
      : 0;
    
    const purchaseTime = parse(rec.purchaseTime, 'HH:mm', new Date());
    const timeWindowBonus = 
      purchaseTime > parse('14:00', 'HH:mm', new Date()) && 
      purchaseTime < parse('16:00', 'HH:mm', new Date()) 
        ? 10 
        : 0;
    
    totalPoints = 
      alphaNumericRetailerLength + 
      roundDollarBonus + 
      roundQuarterBonus + 
      everyTwoItemsBonus + 
      trimmedLengthBonus +
      oddDateBonus + 
      timeWindowBonus;

    return totalPoints;
  }

  async processReceipt(receipt: Receipt): Promise<string> {
    const uuid = uuidv4();
    const ttl = 100000;
    await this.cacheManager.set(uuid, receipt, ttl);
    return uuid;
  }
}