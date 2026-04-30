import { IsDateString, IsNotEmpty, MaxLength, MinLength, IsString } from 'class-validator';
import { ProductInterface } from '../interfaces/product.interface';

// DTO para request (validación de entrada)
export class ProductRequestDTO implements ProductInterface {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsString()
    @MinLength(6)
    @MaxLength(100)
    name: string;

    @IsString()
    @MinLength(10)
    @MaxLength(200)
    description: string;

    @IsNotEmpty()
    @IsString()
    logo: string;

    @IsDateString()
    date_release: string;

    @IsDateString()
    date_revision: string;
}

// DTO para response (estructura de salida)
export class ProductResponseDTO implements ProductInterface {
    id: string;
    name: string;
    description: string;
    logo: string;
    date_release: string;
    date_revision: string;
}