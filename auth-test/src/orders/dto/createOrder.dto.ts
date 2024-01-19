// create-order.dto.ts
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateOrderDto {
  @IsNotEmpty()
  userId: Types.ObjectId;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  @IsNotEmpty()
  totalAmount: number;
}

export class ProductDto {
  @IsNotEmpty()
  productId: Types.ObjectId;

  @IsNotEmpty()
  quantity: number;
}
