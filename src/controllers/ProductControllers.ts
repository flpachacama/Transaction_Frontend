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
import { ProductRequestDTO, ProductResponseDTO, ProductUpdateRequestDTO } from '../dto/Product';
import { MESSAGE_ERROR } from "../const/message-error.const";
import { ProductInterface } from "../interfaces/product.interface";

@JsonController("/products")
export class ProductController {
  products: ProductInterface[] = [];

  @Get("")
  getAll() {
    return {
      data: [...this.products],
    };
  }

  @Get('/verification/:id')
  verifyIdentifier(@Param('id') id: number | string) {
    return this.products.some((product) => product.id === id);
  }

  @Get('/:id/verify')
  verifyIdentifierLegacy(@Param('id') id: number | string) {
    const exists = this.products.some((product) => product.id === id);
    return { data: { exists } };
  }

  @Get("/:id")
  getOne(@Param("id") id: number | string) {
    const index = this.findIndex(id);

    if(index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }
    return { data: this.products.find((product) => product.id === id) };
  }

  @Post("")
  createItem(@Body({ validate: true }) productItem: ProductRequestDTO) {
    this.validateBusinessRules(productItem.date_release, productItem.date_revision);

    const index = this.findIndex(productItem.id);

    if(index !== -1) {
      throw new BadRequestError(MESSAGE_ERROR.DuplicateIdentifier);
    }
    
    this.products.push(productItem as ProductResponseDTO);
    return {
      message: 'Product added successfully',
      data: productItem,
    };
  }

  @Put("/:id")
  put(@Param("id") id: number | string, @Body({ validate: true }) productItem: ProductUpdateRequestDTO) {
    this.validateBusinessRules(productItem.date_release, productItem.date_revision);

    const index = this.findIndex(id);

    if(index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }

    this.products[index] = {
      ...this.products[index],
      ...productItem,
    };
    return {
      message: 'Product updated successfully',
      data: this.products[index],
    };
  }

  @Delete("/:id")
  remove(@Param("id") id: number | string) {
    const index = this.findIndex(id);

    if(index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }
        
    this.products = [...this.products.filter((product) => product.id !== id)];
    return { message: 'Product removed successfully' };
  }

  private findIndex(id: number | string) {
    return this.products.findIndex((product) => product.id === id);
  }

  private validateBusinessRules(dateRelease: string, dateRevision: string) {
    const release = new Date(dateRelease);
    const revision = new Date(dateRevision);

    if (Number.isNaN(release.getTime()) || Number.isNaN(revision.getTime())) {
      throw new BadRequestError(MESSAGE_ERROR.InvalidDate);
    }

    const today = new Date();
    const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const releaseUtc = Date.UTC(release.getFullYear(), release.getMonth(), release.getDate());

    if (releaseUtc < todayUtc) {
      throw new BadRequestError(MESSAGE_ERROR.InvalidReleaseDate);
    }

    const expectedRevision = new Date(release);
    expectedRevision.setFullYear(expectedRevision.getFullYear() + 1);
    const expectedRevisionUtc = Date.UTC(
      expectedRevision.getFullYear(),
      expectedRevision.getMonth(),
      expectedRevision.getDate()
    );
    const revisionUtc = Date.UTC(revision.getFullYear(), revision.getMonth(), revision.getDate());

    if (revisionUtc !== expectedRevisionUtc) {
      throw new BadRequestError(MESSAGE_ERROR.InvalidRevisionDate);
    }
  }

}
