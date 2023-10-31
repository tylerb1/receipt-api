
import { 
  IsArray, 
  IsString, 
  IsDateString, 
  IsMilitaryTime, 
  IsNumberString 
} from 'class-validator';

export class ReceiptDto {
  @IsString()
  retailer: string;

  @IsDateString()
  purchaseDate: string;

  @IsMilitaryTime()
  purchaseTime: string;

  @IsNumberString()
  total: string;

  @IsArray()
  items: Item[];
}

export class Item {
  @IsString()
  shortDescription: string;

  @IsNumberString()
  price: string;
}
