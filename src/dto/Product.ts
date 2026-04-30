import { IsDateString, IsNotEmpty, MaxLength, MinLength, IsString } from 'class-validator';
import { ProductInterface } from '../interfaces/product.interface';

export class ProductRequestDTO implements ProductInterface {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    id: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(100)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    @MaxLength(200)
    description: string;

    @IsNotEmpty()
    @IsString()
    logo: string;

    @IsNotEmpty()
    @IsDateString()
    date_release: string;

    @IsNotEmpty()
    @IsDateString()
    date_revision: string;
}

export class ProductUpdateRequestDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(100)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    @MaxLength(200)
    description: string;

    @IsNotEmpty()
    @IsString()
    logo: string;

    @IsNotEmpty()
    @IsDateString()
    date_release: string;

    @IsNotEmpty()
    @IsDateString()
    date_revision: string;
}

export class ProductResponseDTO implements ProductInterface {
    id: string;
    name: string;
    description: string;
    logo: string;
    date_release: string;
    date_revision: string;
}