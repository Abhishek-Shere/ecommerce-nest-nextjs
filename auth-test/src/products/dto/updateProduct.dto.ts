import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Please enter a product name' })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Price must be a positive number' })
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Quantity must be 0 or a positive number' })

  // @IsPositive({ message: 'Stock must be a positive number' })
  stock: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}
