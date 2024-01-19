// update-order.dto.ts
import { IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateProductDto {
  @IsNotEmpty()
  productId?: string;

  @IsNotEmpty()
  quantity?: number;
}

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductDto)
  products?: UpdateProductDto[];

  @IsNotEmpty()
  totalAmount: number;

  // Add similar decorators for other fields that can be updated
}
