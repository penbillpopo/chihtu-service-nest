import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/product/create-product.dto';
import { CreateProdCategoryDTO } from './dto/prodCategory/create-prodCategory.dto';
import { CreateShipCategoryDTO } from './dto/shipCategory/create-shipCategory.dto';
import { GetProductDTO } from './dto/product/get-product.dto';
import { GetProductDetailDTO } from './dto/product/get-productDetail.dto';
import { GetProdCategoryDTO } from './dto/prodCategory/get-prodCategory.dto';
import { GetShipCategoryDTO } from './dto/shipCategory/get-shipCategory.dto';
import { UpdateProductDTO } from './dto/product/update-product.dto';
import { UpdateProdCategoryDTO } from './dto/prodCategory/update-prodCategory.dto';
import { UpdateShipCategoryDTO } from './dto/shipCategory/update-shipCategory.dto';
import { DeleteProductDTO } from './dto/product/delete-product.dto';
import { DeleteProdCategoryDTO } from './dto/prodCategory/delete-prodCategory.dto';
import { DeleteShipCategoryDTO } from './dto/shipCategory/delete-shipCategory.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Post, UseInterceptors,UploadedFile,
     UsePipes, ValidationPipe, Body,Get,Query,Put,Delete, Param, Res} from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { of } from 'rxjs';
export const storage = {
    storage: diskStorage({
        destination: './uploads/product',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`)
        }
    })
}

@ApiTags('product')
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}
    /* product */
    @Post()
    @ApiOperation({description:"新增產品"})
    @UseInterceptors(FileInterceptor('body'))
    @UsePipes(ValidationPipe)
    async createProduct(@Body() createProductDTO:CreateProductDTO) {
        const res = await this.productService.createProduct(createProductDTO);
        if(res){
            return { success: true, data: null, msg: '新增成功' };
        }else{
            return { success: false, data: null, msg: '新增失敗' };
        }
    }
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file){
        if(file){
            return { success: true, data: {fileName: file.filename}, msg: '新增成功' };
        }else{
            return { success: false, data: null, msg: '新增失敗' };
        }
    }
    @Get('image')
    getProdImage(@Query() query, @Res() res) {
        return of(res.sendFile(join(process.cwd(), 'uploads/product/' + query.name)));
    }

    @Get()
    @ApiOperation({description:"取得產品"})
    async getProducts(@Query() getProductDTO:GetProductDTO) {
        const products = await this.productService.getProducts(getProductDTO)
        if (products) {
            return { success: true, data: products, msg: '搜尋成功' };
        } else {
            return { success: false, data: null, msg: '查無資料' };
        }
    }
    @Get('/detail')
    @ApiOperation({description:"取得詳細產品"})
    async getProductDetail(@Query() getProductDetailDTO:GetProductDetailDTO) {
        const product = await this.productService.getProductDetail(getProductDetailDTO)
        if (product) {
            return { success: true, data: product, msg: '搜尋成功' };
        } else {
            return { success: false, data: null, msg: '查無資料' };
        }
    }
    @Put()
    @UseInterceptors(FileInterceptor('body'))
    @UsePipes(ValidationPipe)
    @ApiOperation({description:"修改使用者"})
    async updateUser(@Body() updateProductDTO: UpdateProductDTO) {
        const users = await this.productService.updateProduct(updateProductDTO);
        if (users) {
        return { success: true, data: null, msg: '更新成功' };
        } else {
        return { success: false, data: null, msg: '更新失敗' };
        }
    }
    @Delete()
    @UseInterceptors(FileInterceptor('body'))
    @UsePipes(ValidationPipe)
    @ApiOperation({description:"刪除使用者"})
    async deleteUser(@Body() deleteProductDTO: DeleteProductDTO) {
      const product = await this.productService.deleteProduct(deleteProductDTO);
      if (product) {
        return { success: true, data: null, msg: '刪除成功' };
      } else {
        return { success: false, data: null, msg: '刪除失敗' };
      }
    }
    /* product category */
    @Post('/prodCategory')
    @ApiOperation({description:"新增第一級分類"})
    @UseInterceptors(FileInterceptor('body'))
    @UsePipes(ValidationPipe)
    async createProdCategory(@Body() createProdCategoryDTO:CreateProdCategoryDTO) {
        const res = await this.productService.createProdCategory(createProdCategoryDTO);
        if(res){
            return { success: true, data: null, msg: '新增成功' };
        }else{
            return { success: false, data: null, msg: '新增失敗' };
        }
    }
    @Get('/prodCategory')
    @ApiOperation({description:"取得第一級分類"})
    async getProdCategory(@Query() getProdCategoryDTO:GetProdCategoryDTO) {
        const categories = await this.productService.getProdCategory(getProdCategoryDTO)
        if (categories) {
            return { success: true, data: categories, msg: '搜尋成功' };
        } else {
            return { success: false, data: null, msg: '查無資料' };
        }
    }
    @Put('/prodCategory')
    @UseInterceptors(FileInterceptor('body'))
    @UsePipes(ValidationPipe)
    @ApiOperation({description:"修改第一級分類"})
    async updateProdCategory(@Body() updateProdCategoryDTO: UpdateProdCategoryDTO) {
        const categories = await this.productService.updateProdCategory(updateProdCategoryDTO);
        if (categories) {
        return { success: true, data: null, msg: '更新成功' };
        } else {
        return { success: false, data: null, msg: '更新失敗' };
        }
    }
    @Delete('/prodCategory')
    @UseInterceptors(FileInterceptor('body'))
    @UsePipes(ValidationPipe)
    @ApiOperation({description:"刪除使用者"})
    async deleteProdCategory(@Body() deleteProdCategoryDTO: DeleteProdCategoryDTO) {
      const categories = await this.productService.deleteProdCategory(deleteProdCategoryDTO);
      if (categories) {
        return { success: true, data: null, msg: '刪除成功' };
      } else {
        return { success: false, data: null, msg: '刪除失敗' };
      }
    }
    /* prod category select*/

    @Get('/prodCategory/select')
    @ApiOperation({description:"取得分類選項"})
    async getProdCategorySelect() {
        const categories = await this.productService.getProdCategorySelect()
        if (categories) {
            return { success: true, data: categories, msg: '搜尋成功' };
        } else {
            return { success: false, data: null, msg: '查無資料' };
        }
    }

    /* shipment category */
    @Post('/shipCategory')
    @ApiOperation({description:"新增運送分類"})
    @UseInterceptors(FileInterceptor('body'))
    @UsePipes(ValidationPipe)
    async createShipCategory(@Body() createShipCategoryDTO:CreateShipCategoryDTO) {
        const res = await this.productService.createShipCategory(createShipCategoryDTO);
        if(res){
            return { success: true, data: null, msg: '新增成功' };
        }else{
            return { success: false, data: null, msg: '新增失敗' };
        }
    }
    @Get('/shipCategory')
    @ApiOperation({description:"取得運送分類"})
    async getShipCategory(@Query() getShipCategoryDTO:GetShipCategoryDTO) {
        const categories = await this.productService.getShipCategory(getShipCategoryDTO)
        if (categories) {
            return { success: true, data: categories, msg: '搜尋成功' };
        } else {
            return { success: false, data: null, msg: '查無資料' };
        }
    }
    @Put('/shipCategory')
    @UseInterceptors(FileInterceptor('body'))
    @UsePipes(ValidationPipe)
    @ApiOperation({description:"修改運送分類"})
    async updateShipCategory(@Body() updateShipCategoryDTO: UpdateShipCategoryDTO) {
        const categories = await this.productService.updateShipCategory(updateShipCategoryDTO);
        if (categories) {
        return { success: true, data: null, msg: '更新成功' };
        } else {
        return { success: false, data: null, msg: '更新失敗' };
        }
    }
    @Delete('/shipCategory')
    @UseInterceptors(FileInterceptor('body'))
    @UsePipes(ValidationPipe)
    @ApiOperation({description:"刪除運送分類"})
    async deleteShipCategory(@Body() deleteShipCategoryDTO: DeleteShipCategoryDTO) {
      const categories = await this.productService.deleteShipCategory(deleteShipCategoryDTO);
      if (categories) {
        return { success: true, data: null, msg: '刪除成功' };
      } else {
        return { success: false, data: null, msg: '刪除失敗' };
      }
    }
}
