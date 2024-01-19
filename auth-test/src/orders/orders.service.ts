import { Injectable } from '@nestjs/common';
import { Order } from './schemas/order.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from './dto/createOrder.dto';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<Order>,
    private productService: ProductsService,
  ) {}

  async createOrder(orderDto: CreateOrderDto): Promise<Order> {
    let savedOrder: Order;

    try {
      const order = new this.orderModel(orderDto);
      savedOrder = await order.save();

      // Update product stock
      if (savedOrder) {
        for (const productDto of orderDto.products) {
          await this.productService.updateProductStock(
            productDto.productId,
            productDto.quantity,
          );
        }
      }
    } catch (error) {
      throw error;
    } finally {
    }

    return savedOrder;
  }

  async getOrdersForUser(userId: string): Promise<Order[]> {
    try {
      const user_order = this.orderModel
        .find({ userId })
        .populate('products.productId')
        .exec();
      return user_order;
    } catch (error) {}
  }

  async updateOrder(
    orderId: Types.ObjectId,
    updatOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    try {
      const exitingOrder = await this.orderModel.findById({ _id: orderId });
      const updatedOrder = await this.orderModel.findOneAndUpdate(
        { _id: orderId },
        {
          $set: {
            products: updatOrderDto.products,
            totalAmount: updatOrderDto.totalAmount,
          },
        },
        { returnOriginal: false },
      );

      const productUpdates = updatedOrder.products.map(
        ({ productId, quantity }) => {
          const originalQuantity = exitingOrder.products.find(
            (p) => p.productId.toString() == productId.toString(),
          );
          const difference = quantity - originalQuantity.quantity;

          return {
            productId: productId,
            quantity: difference,
          };
        },
      );
      if (updatedOrder && productUpdates.length > 0) {
        for (const product of productUpdates) {
          this.productService.updateProductStock(
            product.productId as unknown as Types.ObjectId,
            product.quantity,
          );
        }
      }
      return updatedOrder;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getOrder(orderId: string): Promise<Order> {
    try {
      const order = this.orderModel
        .findById({ _id: orderId })
        .populate('products.productId')
        .exec();
      return order;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getOrders(): Promise<Order[]> {
    try {
      const orders = this.orderModel
        .find({})
        .populate('products.productId')
        .exec();
      return orders;
    } catch (error) {
      throw new Error(error);
    }
  }
}
