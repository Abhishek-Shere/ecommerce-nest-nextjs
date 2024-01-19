import { IsString, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Please enter a product name' })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Price must be a positive number' })
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Stock must be a positive number' })
  stock: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  createdBy: Types.ObjectId; // Reference to the User who created the product
}
