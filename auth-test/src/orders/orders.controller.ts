import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Order } from './schemas/order.schema';
import { AuthGuard } from 'src/users/auth.guard';
import { Types } from 'mongoose';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { Roles } from 'src/users/role.decorator';
import { MultiplePermissions } from 'src/users/permissions.decorators';
import { RolesGuard } from 'src/users/roles.guard';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Roles('customer', 'admin', 'superadmin')
  @MultiplePermissions(
    {
      role: 'customer',
      permissions: ['GET', 'POST', 'PUT', 'DELETE'],
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
  @Post('order')
  @UseGuards(AuthGuard, RolesGuard)
  async createOrder(@Body() orderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(orderDto);
  }

  @Roles('customer', 'admin', 'superadmin')
  @MultiplePermissions(
    {
      role: 'customer',
      permissions: ['GET', 'POST', 'PUT', 'DELETE'],
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
  @Get('user/:userId')
  @UseGuards(AuthGuard, RolesGuard)
  async getUserOrders(@Param('userId') userId: string) {
    return this.orderService.getOrdersForUser(userId);
  }

  @Roles('customer', 'admin', 'superadmin')
  @MultiplePermissions(
    {
      role: 'customer',
      permissions: ['GET', 'POST', 'PUT', 'DELETE'],
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
  @Put('order/:id')
  @UseGuards(AuthGuard, RolesGuard)
  async updateOrder(
    @Param('id') orderId: Types.ObjectId,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.orderService.updateOrder(orderId, updateOrderDto);
  }

  @Roles('customer', 'admin', 'superadmin')
  @MultiplePermissions(
    {
      role: 'customer',
      permissions: ['GET', 'POST', 'PUT', 'DELETE'],
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
  @Get('order/:id')
  @UseGuards(AuthGuard, RolesGuard)
  async getOder(@Param('id') orderID: string): Promise<Order> {
    return this.orderService.getOrder(orderID);
  }

  @Roles('admin', 'superadmin')
  @MultiplePermissions(
    {
      role: 'customer',
      permissions: [],
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
  @Get('')
  @UseGuards(AuthGuard, RolesGuard)
  async getOders(): Promise<Order[]> {
    return this.orderService.getOrders();
  }
}
