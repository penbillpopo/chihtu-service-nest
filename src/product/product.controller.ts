import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/product/create-product.dto';
import { CreateProdCategoryDTO } from './dto/prodCategory/create-prodCategory.dto';
import { CreateShipCategoryDTO } from './dto/shipCategory/create-shipCategory.dto';
import { GetProductDTO } from './dto/product/get-product.dto';
import { GetProdCategoryDTO } from './dto/prodCategory/get-prodCategory.dto';
import { GetShipCategoryDTO } from './dto/shipCategory/get-shipCategory.dto';
import { UpdateProductDTO } from './dto/product/update-product.dto';
import { UpdateProdCategoryDTO } from './dto/prodCategory/update-prodCategory.dto';
import { UpdateShipCategoryDTO } from './dto/shipCategory/update-shipCategory.dto';
import { IdDTO } from '../shared/dto/idDto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Post, UseInterceptors,UploadedFile,
     UsePipes, ValidationPipe, Body,Get,Query,Put,Delete, Res} from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { of } from 'rxjs';
export const ApiFile = (fileName: string = 'file'): MethodDecorator => (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
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
    @ApiOperation({description:"????????????"})
    @UseInterceptors(FileInterceptor('body'))
    @UsePipes(ValidationPipe)
    async createProduct(@Body() createProductDTO:CreateProductDTO) {
        const res = await this.productService.createProduct(createProductDTO);
        if(res){
            return { success: true, data: null, msg: '????????????' };
        }else{
            return { success: false, data: null, msg: '????????????' };
        }
    }
    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @ApiFile()
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file){
        if(file){
            return { success: true, data: {fileName: file.filename}, msg: '????????????' };
        }else{
            return { success: false, data: null, msg: '????????????' };
        }
    }
    @Get('image')
    getProdImage(@Query() query, @Res() res) {
        return of(res.sendFile(join(process.cwd(), 'uploads/product/' + query.name)));
    }

    @Get()
    @ApiOperation({description:"????????????"})
    async getProducts(@Query() getProductDTO:GetProductDTO) {
        const products = await this.productService.getProducts(getProductDTO)
        if (products) {
            return { success: true, data: products, msg: '????????????' };
        } else {
            return { success: false, data: null, msg: '????????????' };
        }
    }
    @Get('/detail')
    @ApiOperation({description:"??????????????????"})
    async getProductDetail(@Query() idDto:IdDTO) {
        const product = await this.productService.getProductDetail(idDto)
        if (product) {
            return { success: true, data: product, msg: '????????????' };
        } else {
            return { success: false, data: null, msg: '????????????' };
        }
    }
    @Put()
    @UseInterceptors(FileInterceptor('body'))
    @UsePipes(ValidationPipe)
    @ApiOperation({description:"???????????????"})
    async updateUser(@Query() idDto:IdDTO,@Body() updateProductDTO: UpdateProductDTO) {
        const users = await this.productService.updateProduct(idDto,updateProductDTO);
        if (users) {
        return { success: true, data: null, msg: '????????????' };
        } else {
        return { success: false, data: null, msg: '????????????' };
        }
    }
    @Delete()
    @UseInterceptors(FileInterceptor('body'))
    @UsePipes(ValidationPipe)
    @ApiOperation({description:"???????????????"})
    async deleteUser(@Query() idDto:IdDTO) {
      const product = await this.productService.deleteProduct(idDto);
      if (product) {
        return { success: true, data: null, msg: '????????????' };
      } else {
        return { success: false, data: null, msg: '????????????' };
      }
    }
    /* product category */
    @Post('/prodCategory')
    @ApiOperation({description:"?????????????????????"})
    @UseInterceptors(FileInterceptor('body'))
    @UsePipes(ValidationPipe)
    async createProdCategory(@Body() createProdCategoryDTO:CreateProdCategoryDTO) {
        const res = await this.productService.createProdCategory(createProdCategoryDTO);
        if(res){
            return { success: true, data: null, msg: '????????????' };
        }else{
            return { success: false, data: null, msg: '????????????' };
        }
    }
    @Get('/prodCategory')
    @ApiOperation({description:"?????????????????????"})
    async getProdCategory(@Query() getProdCategoryDTO:GetProdCategoryDTO) {
        const categories = await this.productService.getProdCategory(getProdCategoryDTO)
        if (categories) {
            return { success: true, data: categories, msg: '????????????' };
        } else {
            return { success: false, data: null, msg: '????????????' };
        }
    }
    @Put('/prodCategory')
    @UseInterceptors(FileInterceptor('body'))
    @UsePipes(ValidationPipe)
    @ApiOperation({description:"?????????????????????"})
    async updateProdCategory(@Query() idDto:IdDTO,@Body() updateProdCategoryDTO: UpdateProdCategoryDTO) {
        const categories = await this.productService.updateProdCategory(idDto,updateProdCategoryDTO);
        if (categories) {
        return { success: true, data: null, msg: '????????????' };
        } else {
        return { success: false, data: null, msg: '????????????' };
        }
    }
    @Delete('/prodCategory')
    @UseInterceptors(FileInterceptor('body'))
    @UsePipes(ValidationPipe)
    @ApiOperation({description:"???????????????"})
    async deleteProdCategory(@Query() idDto:IdDTO) {
      const categories = await this.productService.deleteProdCategory(idDto);
      if (categories) {
        return { success: true, data: null, msg: '????????????' };
      } else {
        return { success: false, data: null, msg: '????????????' };
      }
    }
    /* prod category select*/

    @Get('/prodCategory/select')
    @ApiOperation({description:"??????????????????"})
    async getProdCategorySelect() {
        const categories = await this.productService.getProdCategorySelect()
        if (categories) {
            return { success: true, data: categories, msg: '????????????' };
        } else {
            return { success: false, data: null, msg: '????????????' };
        }
    }

    /* shipment category */
    @Post('/shipCategory')
    @ApiOperation({description:"??????????????????"})
    @UseInterceptors(FileInterceptor('body'))
    @UsePipes(ValidationPipe)
    async createShipCategory(@Body() createShipCategoryDTO:CreateShipCategoryDTO) {
        const res = await this.productService.createShipCategory(createShipCategoryDTO);
        if(res){
            return { success: true, data: null, msg: '????????????' };
        }else{
            return { success: false, data: null, msg: '????????????' };
        }
    }
    @Get('/shipCategory')
    @ApiOperation({description:"??????????????????"})
    async getShipCategory(@Query() getShipCategoryDTO:GetShipCategoryDTO) {
        const categories = await this.productService.getShipCategory(getShipCategoryDTO)
        if (categories) {
            return { success: true, data: categories, msg: '????????????' };
        } else {
            return { success: false, data: null, msg: '????????????' };
        }
    }
    @Put('/shipCategory')
    @UseInterceptors(FileInterceptor('body'))
    @UsePipes(ValidationPipe)
    @ApiOperation({description:"??????????????????"})
    async updateShipCategory(@Query() idDto:IdDTO,@Body() updateShipCategoryDTO: UpdateShipCategoryDTO) {
        const categories = await this.productService.updateShipCategory(idDto,updateShipCategoryDTO);
        if (categories) {
        return { success: true, data: null, msg: '????????????' };
        } else {
        return { success: false, data: null, msg: '????????????' };
        }
    }
    @Delete('/shipCategory')
    @UseInterceptors(FileInterceptor('body'))
    @UsePipes(ValidationPipe)
    @ApiOperation({description:"??????????????????"})
    async deleteShipCategory(@Query() idDto:IdDTO) {
      const categories = await this.productService.deleteShipCategory(idDto);
      if (categories) {
        return { success: true, data: null, msg: '????????????' };
      } else {
        return { success: false, data: null, msg: '????????????' };
      }
    }
}
