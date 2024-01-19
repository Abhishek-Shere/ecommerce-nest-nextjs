import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/users/auth.guard';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';
import { Types } from 'mongoose';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { Roles } from 'src/users/role.decorator';
import { MultiplePermissions } from 'src/users/permissions.decorators';
import { RolesGuard } from 'src/users/roles.guard';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}
  @Roles('customer', 'admin', 'superadmin')
  @MultiplePermissions(
    {
      role: 'customer',
      permissions: ['GET'],
    },
    {
      role: 'admin',
      permissions: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    {
      role: 'superadmin',
      permissions: ['GET', 'DELETE'],
    },
  )
  @Post('product')
  @UseGuards(AuthGuard, RolesGuard)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Roles('customer', 'admin', 'superadmin')
  @MultiplePermissions(
    {
      role: 'customer',
      permissions: ['GET'],
    },
    {
      role: 'admin',
      permissions: ['GET'],
    },
    {
      role: 'superadmin',
      permissions: ['GET'],
    },
  )
  @Get('all-products')
  @UseGuards(AuthGuard, RolesGuard)
  async getAllProducts(): Promise<Product[]> {
    console.log('0000000');
    return this.productService.getAllProducts();
  }

  @Roles('customer', 'admin', 'superadmin')
  @MultiplePermissions(
    {
      role: 'customer',
      permissions: ['GET'],
    },
    {
      role: 'admin',
      permissions: ['DELETE'],
    },
    {
      role: 'superadmin',
      permissions: ['DELETE'],
    },
  )
  @Delete('product/:id')
  @UseGuards(AuthGuard, RolesGuard)
  async deleteProduct(
    @Param('id') productId: Types.ObjectId,
  ): Promise<{ success: boolean; message: string }> {
    return this.productService.deleteProduct(productId);
  }

  @Roles('customer', 'admin', 'superadmin')
  @MultiplePermissions(
    {
      role: 'customer',
      permissions: ['GET'],
    },
    {
      role: 'admin',
      permissions: ['PUT'],
    },
    {
      role: 'superadmin',
      permissions: ['PUT'],
    },
  )
  @Put('product/:id')
  @UseGuards(AuthGuard, RolesGuard)
  async updateProduct(
    @Param('id') productId: Types.ObjectId,
    @Body() updateProduct: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(productId, updateProduct);
  }

  @Roles('customer', 'admin', 'superadmin')
  @MultiplePermissions(
    {
      role: 'customer',
      permissions: ['GET'],
    },
    {
      role: 'admin',
      permissions: ['GET'],
    },
    {
      role: 'superadmin',
      permissions: ['GET'],
    },
  )
  @Get('product/:id')
  @UseGuards(AuthGuard, RolesGuard)
  async getProduct(@Param('id') productId: Types.ObjectId): Promise<Product> {
    return this.productService.getProduct(productId);
  }
}
