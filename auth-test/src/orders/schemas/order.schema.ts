// order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({
    type: [
      {
        productId: { type: MongooseSchema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
      },
    ],
  })
  products: { productId: string; quantity: number }[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: 'Shipped' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
