import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { productSchema,ProductName } from './product.model';
import { prodCategorySchema,ProdCategoryName } from './prodCategory.model';
import { prodSpecSchema,ProdSpecName } from './prodSpec.model';
import { subProdCategorySchema,SubProdCategoryName } from './subProdCategory.model';
import { shipCategorySchema,ShipCategoryName } from './shipCategory.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductName, schema: productSchema },
      { name: ProdCategoryName, schema: prodCategorySchema },
      { name: ProdSpecName, schema: prodSpecSchema },
      { name: SubProdCategoryName, schema: subProdCategorySchema },
      { name: ShipCategoryName, schema: shipCategorySchema },
    ])
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
