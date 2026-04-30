"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
require("reflect-metadata");
const routing_controllers_1 = require("routing-controllers");
const Product_1 = require("../dto/Product");
const message_error_const_1 = require("../const/message-error.const");
let ProductController = class ProductController {
    constructor() {
        this.products = [];
    }
    getAll() {
        return {
            data: [...this.products],
        };
    }
    verifyIdentifier(id) {
        return this.products.some((product) => product.id === id);
    }
    verifyIdentifierLegacy(id) {
        const exists = this.products.some((product) => product.id === id);
        return { data: { exists } };
    }
    getOne(id) {
        const index = this.findIndex(id);
        if (index === -1) {
            throw new routing_controllers_1.NotFoundError(message_error_const_1.MESSAGE_ERROR.NotFound);
        }
        return { data: this.products.find((product) => product.id === id) };
    }
    createItem(productItem) {
        this.validateBusinessRules(productItem.date_release, productItem.date_revision);
        const index = this.findIndex(productItem.id);
        if (index !== -1) {
            throw new routing_controllers_1.BadRequestError(message_error_const_1.MESSAGE_ERROR.DuplicateIdentifier);
        }
        this.products.push(productItem);
        return {
            message: 'Product added successfully',
            data: productItem,
        };
    }
    put(id, productItem) {
        this.validateBusinessRules(productItem.date_release, productItem.date_revision);
        const index = this.findIndex(id);
        if (index === -1) {
            throw new routing_controllers_1.NotFoundError(message_error_const_1.MESSAGE_ERROR.NotFound);
        }
        this.products[index] = Object.assign(Object.assign({}, this.products[index]), productItem);
        return {
            message: 'Product updated successfully',
            data: this.products[index],
        };
    }
    remove(id) {
        const index = this.findIndex(id);
        if (index === -1) {
            throw new routing_controllers_1.NotFoundError(message_error_const_1.MESSAGE_ERROR.NotFound);
        }
        this.products = [...this.products.filter((product) => product.id !== id)];
        return { message: 'Product removed successfully' };
    }
    findIndex(id) {
        return this.products.findIndex((product) => product.id === id);
    }
    validateBusinessRules(dateRelease, dateRevision) {
        const release = new Date(dateRelease);
        const revision = new Date(dateRevision);
        if (Number.isNaN(release.getTime()) || Number.isNaN(revision.getTime())) {
            throw new routing_controllers_1.BadRequestError(message_error_const_1.MESSAGE_ERROR.InvalidDate);
        }
        const today = new Date();
        const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
        const releaseUtc = Date.UTC(release.getFullYear(), release.getMonth(), release.getDate());
        if (releaseUtc < todayUtc) {
            throw new routing_controllers_1.BadRequestError(message_error_const_1.MESSAGE_ERROR.InvalidReleaseDate);
        }
        const expectedRevision = new Date(release);
        expectedRevision.setFullYear(expectedRevision.getFullYear() + 1);
        const expectedRevisionUtc = Date.UTC(expectedRevision.getFullYear(), expectedRevision.getMonth(), expectedRevision.getDate());
        const revisionUtc = Date.UTC(revision.getFullYear(), revision.getMonth(), revision.getDate());
        if (revisionUtc !== expectedRevisionUtc) {
            throw new routing_controllers_1.BadRequestError(message_error_const_1.MESSAGE_ERROR.InvalidRevisionDate);
        }
    }
};
__decorate([
    (0, routing_controllers_1.Get)(""),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "getAll", null);
__decorate([
    (0, routing_controllers_1.Get)('/verification/:id'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "verifyIdentifier", null);
__decorate([
    (0, routing_controllers_1.Get)('/:id/verify'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "verifyIdentifierLegacy", null);
__decorate([
    (0, routing_controllers_1.Get)("/:id"),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "getOne", null);
__decorate([
    (0, routing_controllers_1.Post)(""),
    __param(0, (0, routing_controllers_1.Body)({ validate: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Product_1.ProductRequestDTO]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "createItem", null);
__decorate([
    (0, routing_controllers_1.Put)("/:id"),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __param(1, (0, routing_controllers_1.Body)({ validate: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Product_1.ProductUpdateRequestDTO]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "put", null);
__decorate([
    (0, routing_controllers_1.Delete)("/:id"),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "remove", null);
ProductController = __decorate([
    (0, routing_controllers_1.JsonController)("/products")
], ProductController);
exports.ProductController = ProductController;
