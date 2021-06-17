import { ProductModel,ProductName } from './product.model';
import { ProdCategoryModel,ProdCategoryName } from './prodCategory.model';
import { ProdSpecModel,ProdSpecName } from './prodSpec.model';
import { SubProdCategoryModel,SubProdCategoryName } from './subProdCategory.model';
import { ShipCategoryModel,ShipCategoryName } from './shipCategory.model';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable,NotFoundException } from '@nestjs/common';
import { CreateProductDTO } from './dto/product/create-product.dto';
import { CreateProdCategoryDTO } from './dto/prodCategory/create-prodCategory.dto';
import { CreateShipCategoryDTO } from './dto/shipCategory/create-shipCategory.dto';
import { GetProductDTO } from './dto/product/get-product.dto';
import { GetProdCategoryDTO } from './dto/prodCategory/get-prodCategory.dto';
import { GetShipCategoryDTO } from './dto/shipCategory/get-shipCategory.dto';
import { UpdateProductDTO } from './dto/product/update-product.dto';
import { UpdateProdCategoryDTO } from './dto/prodCategory/update-prodCategory.dto';
import { UpdateShipCategoryDTO } from './dto/shipCategory/update-shipCategory.dto';
import { IProdSpec } from './format/IProdSpec'
import { Model } from 'mongoose';
import { IdDTO } from '../shared/dto/idDto.dto';
import * as moment from 'moment';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(ProductName)
        private readonly productModel: Model<ProductModel>,
        @InjectModel(ProdSpecName)
        private readonly prodSpecModel: Model<ProdSpecModel>,
        @InjectModel(ProdCategoryName)
        private readonly prodCategoryModel: Model<ProdCategoryModel>,
        @InjectModel(SubProdCategoryName)
        private readonly subProdCategoryModel: Model<SubProdCategoryModel>,
        @InjectModel(ShipCategoryName)
        private readonly shipCategoryModel: Model<ShipCategoryModel>,
    ) {}
    /* product */
    async createProduct(createProductDTO:CreateProductDTO){
        const { hasSpec,spec } = createProductDTO;
        const formData = Object.assign({},createProductDTO)
        //0:無規格、1:有規格
        if(hasSpec===1){
            formData.price = null
            formData.count = null
            formData.number = null
        }
        else{
            formData.firstSpec = null
            formData.secondSpec = null
            formData.spec = null
        }
        const newProduct = new this.productModel(formData);
        const res = await newProduct.save();
        if(hasSpec===1){
            await this.createSpec(spec,newProduct.id)
        }
        if(res){
            return true
        }else{
            return false
        }
    }
    async getProducts(getProductDTO:GetProductDTO) {
        const {page,pageSize} = getProductDTO
        const _pageSize = Number(pageSize)
        const _page = (Number(page) - 1) * Number(pageSize)
        const products = await this.productModel.find({}).limit(_pageSize).skip(_page).sort({createdAt:1})
        const total = await this.productModel.count({})
        const data = products.map((product) => ({
            id: product.id,
            name: product.name,
            count: product.count,
            number: product.number,
            headImage: product.headImage,
            prodImages: product.prodImages,
            status: product.status,
            createdAt: moment(new Date(product.createdAt)).format(
                'YYYY/MM/DD hh:mm:ss',
            ),
            updatedAt: moment(new Date(product.updatedAt)).format(
                'YYYY/MM/DD hh:mm:ss',
            ),
          }));
        return {content:data,total:total};
    }
    async getProductDetail(idDto:IdDTO) {
        const { id } = idDto
        const product = await this.productModel.findById(id)
        const data = {
            id: product.id,
            name: product.name,
            firstCategory: product.firstCategory,
            secondCategory: product.secondCategory,
            detail: product.detail,
            hasSpec: product.hasSpec,
            firstSpec: product.firstSpec,
            secondSpec: product.secondSpec,
            price: product.price,
            count: product.count,
            number: product.number,
            headImage: product.headImage,
            prodImages: product.prodImages,
            status: product.status,
            spec: []
        }
        if(data.hasSpec===1){
            const specData = await this.prodSpecModel.find({specId:product.id})
            const specArr = []
            specData.forEach(element => {
                specArr.push({
                    firstSpec:element.firstSpec,
                    secondSpec:element.secondSpec,
                    number:element.number,
                    price:element.price,
                    count:element.count,
                })
            });
            data.spec = specArr
        }
        return {content:data,total:1};
    }
    async updateProduct(idDto:IdDTO,updateProductDTO: UpdateProductDTO) {
        const { name, firstCategory,secondCategory,detail,hasSpec,firstSpec,secondSpec,
            price,count,number,status,spec,headImage,prodImages } = updateProductDTO;
        const { id } = idDto
        const updateProduct = await this.productModel.findById(id).exec();
        if (updateProduct) {
            updateProduct.name = name;
            updateProduct.firstCategory = firstCategory;
            updateProduct.secondCategory = secondCategory;
            updateProduct.detail = detail;
            updateProduct.hasSpec = hasSpec;
            updateProduct.status = status;
            updateProduct.headImage = headImage;
            updateProduct.prodImages = prodImages;
            await this.deleteSpec(id)
            if(hasSpec===1){
                updateProduct.price = null;
                updateProduct.count = null;
                updateProduct.number = null;
                updateProduct.firstSpec = firstSpec;
                updateProduct.secondSpec = secondSpec||null;
                await this.createSpec(spec,id)
            }
            else{
                updateProduct.price = price;
                updateProduct.count = count;
                updateProduct.number = number;
                updateProduct.firstSpec = null;
                updateProduct.secondSpec = null;
            }
            updateProduct.save();
            return true;
        } else {
            throw new NotFoundException();
        }
    }
    async deleteProduct(idDto:IdDTO) {
        const { id } = idDto;
        const res = await this.productModel.deleteOne({ _id: id }).exec();
        if (res.n === 0) {
          return false;
        } else {
          return true;
        }
    }
    /* prod spec */
    createSpec(spec:Array<IProdSpec>,id:string){
        return new Promise<void>(async (resolve) => {
            for (let i = 0; i < spec.length; i++) {
                const element = spec[i];
                const newSpec = new this.prodSpecModel({
                    firstSpec: element.firstSpec,
                    secondSpec: element.secondSpec||null,
                    price: element.price,
                    count: element.count,
                    number: element.number,
                    specId: id
                });
                await newSpec.save();
            }
            resolve()
        })
    }
    deleteSpec(id:string){
        return new Promise<void>(async (resolve) => {
            await this.prodSpecModel.deleteMany({ specId: id }).exec();
            resolve()
        })
    }
    /* prod category */
    async createProdCategory(createProdCategoryDTO:CreateProdCategoryDTO){
        const newProdCategory = new this.prodCategoryModel(createProdCategoryDTO);
        const res = await newProdCategory.save();
        const subCategoryList = createProdCategoryDTO.secondCategory.split(',')
        this.createSubCategory(subCategoryList,res.id)
        if(res){
            return true
        }else{
            return false
        }
    }
    async getProdCategory(getProdCategoryDTO:GetProdCategoryDTO) {
        const {page,pageSize} = getProdCategoryDTO
        const _pageSize = Number(pageSize)
        const _page = (Number(page) - 1) * Number(pageSize)
        const prodCategory = await this.prodCategoryModel.find({}).limit(_pageSize).skip(_page).sort({createdAt:1})
        const total = await this.prodCategoryModel.count({})
        const data = prodCategory.map((category) => ({
            id: category.id,
            name:category.name,
            secondCategory:category.secondCategory.split(','),
            createdAt: moment(new Date(category.createdAt)).format(
                'YYYY/MM/DD hh:mm:ss',
            ),
            updatedAt: moment(new Date(category.updatedAt)).format(
                'YYYY/MM/DD hh:mm:ss',
            ),
          }));
        return {content:data,total:total};
    }
    async getProdCategorySelect(){
        const prodCategory = await this.prodCategoryModel.find({})
        const total = await this.prodCategoryModel.count({})
        const data = prodCategory.map((category) => ({
            firstCategory:category.name,
            secondCategory:category.secondCategory.split(','),
          }));
        return {content:data,total:total};
    }
    async updateProdCategory(idDto:IdDTO,updateProdCategoryDTO: UpdateProdCategoryDTO) {
        const { id } = idDto;
        const { name,secondCategory } = updateProdCategoryDTO;
        const updateCategory = await this.prodCategoryModel.findById(id).exec();
        if (updateCategory) {
            updateCategory.name = name;
            updateCategory.secondCategory = secondCategory.toString();
            updateCategory.save();
            const subCategoryList = [...updateCategory.secondCategory]
            await this.deleteAllSubCategory(id)
            await this.createSubCategory(subCategoryList,id)
            return true;
        } else {
            throw new NotFoundException();
        }
    }
    async deleteProdCategory(idDto:IdDTO) {
        const { id } = idDto;
        const res = await this.prodCategoryModel.deleteOne({ _id: id }).exec();
        await this.deleteAllSubCategory(id)
        if (res.n === 0) {
          return false;
        } else {
          return true;
        }
    }
    deleteAllSubCategory(id:string):Promise<void>{
        return new Promise<void>(async (resolve) => {
            await this.subProdCategoryModel.deleteMany({ parentId: id }).exec();
            resolve()
        })
    }
    createSubCategory(subCategoryList,id):Promise<void>{
        return new Promise<void>(async (resolve) => {
            for (let i = 0; i < subCategoryList.length; i++) {
                const element = subCategoryList[i];
                const newSubProdCategory = new this.subProdCategoryModel({
                    name:element,
                    parentId:id
                });
                await newSubProdCategory.save();
            }
            resolve();      
        })
    }
    /* ship category */
    async createShipCategory(createShipCategoryDTO:CreateShipCategoryDTO){
        const newShipCategory = new this.shipCategoryModel(createShipCategoryDTO);
        const res = await newShipCategory.save();
        if(res){
            return true
        }else{
            return false
        }
    }
    async getShipCategory(getShipCategoryDTO:GetShipCategoryDTO) {
        const {page,pageSize} = getShipCategoryDTO
        const _pageSize = Number(pageSize)
        const _page = (Number(page) - 1) * Number(pageSize)
        const shipCategory = await this.shipCategoryModel.find({}).limit(_pageSize).skip(_page).sort({createdAt:1})
        const total = await this.shipCategoryModel.count({})
        const data = shipCategory.map((category) => ({
            id: category.id,
            name:category.name,
            createdAt: moment(new Date(category.createdAt)).format(
                'YYYY/MM/DD hh:mm:ss',
            ),
            updatedAt: moment(new Date(category.updatedAt)).format(
                'YYYY/MM/DD hh:mm:ss',
            ),
          }));
        return {content:data,total:total};
    }
    async updateShipCategory(idDto:IdDTO,updateShipCategoryDTO: UpdateShipCategoryDTO) {
        const { id } = idDto;
        const { name } = updateShipCategoryDTO;
        const updateCategory = await this.shipCategoryModel.findById(id).exec();
        if (updateCategory) {
            updateCategory.name = name;
            updateCategory.save();
            return true;
        } else {
            throw new NotFoundException();
        }
    }
    async deleteShipCategory(idDto:IdDTO) {
        const { id } = idDto;
        const res = await this.shipCategoryModel.deleteOne({ _id: id }).exec();
        if (res.n === 0) {
          return false;
        } else {
          return true;
        }
    }
}
