import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  //   @IsNotEmpty()
  //   @MinLength(8)
  //   readonly password: string[];

  //   @IsOptional() // Make roles optional
  //   @IsString({ each: true }) // Validate each element of the array
  //   readonly roles?: string[];
}
