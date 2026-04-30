import "reflect-metadata";
import {
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  JsonController,
  Params,
  NotFoundError,
  BadRequestError,
} from "routing-controllers";
import { ProductRequestDTO, ProductResponseDTO } from '../dto/Product';
import { MESSAGE_ERROR } from "../const/message-error.const";
import { ProductInterface } from "../interfaces/product.interface";

@JsonController("/products")
export class ProductController {
  products: ProductInterface[] = [];

  @Get("")
  getAll() {
    return {
      success: true,
      data: [...this.products],
    };
  }

  @Get('/:id/verify')
  verifyIdentifier(@Param('id') id: number | string) {
    const exists = this.products.some((product) => product.id === id);
    return { success: true, data: { exists } };
  }

  @Get("/:id")
  getOne(@Param("id") id: number | string) {
    const index = this.findIndex(id);

    if(index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }
    return { success: true, data: this.products.find((product) => product.id === id) };
  }

  @Post("")
  createItem(@Body({ validate: true }) productItem: ProductRequestDTO) {
    
    const index = this.findIndex(productItem.id);

    if(index !== -1) {
      throw new BadRequestError(MESSAGE_ERROR.DuplicateIdentifier);
    }
    
    this.products.push(productItem as ProductResponseDTO);
    return {
      success: true,
      message: 'Product added successfully',
      data: productItem,
    };
  }

  @Put("/:id")
  put(@Param("id") id: number | string, @Body() productItem: ProductInterface) {
    const index = this.findIndex(id);

    if(index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }

    this.products[index] = {
      ...this.products[index],
      ...productItem,
    };
    return {
      success: true,
      message: 'Product updated successfully',
      data: productItem,
    };
  }

  @Delete("/:id")
  remove(@Param("id") id: number | string) {
    const index = this.findIndex(id);

    if(index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }
        
    this.products = [...this.products.filter((product) => product.id !== id)];
    return { success: true, message: 'Product removed successfully' };
  }

  private findIndex(id: number | string) {
    return this.products.findIndex((product) => product.id === id);
  }

}
