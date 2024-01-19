import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  readonly password: string[];

  @IsOptional() // Make roles optional
  @IsString({ each: true }) // Validate each element of the array
  readonly roles?: string[];
}
