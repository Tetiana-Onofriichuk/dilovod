import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;
@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  nameEn!: string;

  @Prop({ required: true })
  calories!: number;

  @Prop({ required: true })
  protein!: number;

  @Prop({ required: true })
  fat!: number;

  @Prop({ required: true })
  carbs!: number;

  @Prop({ required: true })
  category!: string;

  @Prop({ required: true })
  servingSize!: number;

  @Prop({ required: true })
  servingUnit!: string;

  @Prop({ required: true })
  state!: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
