import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  async createProduct(productDto: CreateProductDto): Promise<Product> {
    try {
      const product = new this.productModel({
        ...productDto,
        createdBy: productDto.createdBy, // Set the createdBy field
      });
      return product.save();
    } catch (error) {
      throw new Error('');
    }
  }

  async getProduct(productId: Types.ObjectId): Promise<Product> {
    try {
      const product = await this.productModel.findById({ _id: productId });
      if (product) return product;
      throw new NotFoundException(`Product with ID ${productId} not found`);
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      console.log('===========>');
      const products = await this.productModel.find({});
      return products;
    } catch (error) {
      throw new Error('Unable to get all products');
    }
  }

  async deleteProduct(
    productId: Types.ObjectId,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const isDeleteProduct = await this.productModel.findByIdAndDelete({
        _id: productId,
      });
      if (isDeleteProduct) {
        return {
          success: true,
          message: 'Product deleted successfully',
        };
        return null;
      }
    } catch (error) {
      throw new Error('Unable to delete product');
    }
  }

  async updateProductStock(
    productId: Types.ObjectId,
    quantity: number,
  ): Promise<void> {
    try {
      const product = await this.productModel.findById({ _id: productId });
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      if (product.stock < quantity) {
        throw new Error(`Insufficient stock for product ${productId}`);
      }
      if (quantity > 0) product.stock -= quantity;
      else product.stock += -quantity;
      await product.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(
    productId: Types.ObjectId,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const existingProduct = await this.productModel.findByIdAndUpdate(
        productId,
        { $set: { ...updateProductDto } },
        { new: true },
      );

      if (!existingProduct) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      return existingProduct;
    } catch (error) {
      throw new Error(error);
    }
  }
}
