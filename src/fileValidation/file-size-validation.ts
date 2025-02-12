import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { SEVEN_MEGA } from "./CONSTANTS/sizes-constants";

@Injectable()
export class FileSizeValidationPipe implements PipeTransform{

  //atributes
  private readonly fileSize= 70 * 1024 * 1024;
  private readonly fileType : string[];

  constructor(
   maxSize?: number,
   fileType?: string[]
  ){

    this.fileSize = maxSize || this.fileSize,
    this.fileType = fileType || ['imagem/png', 'image/jpeg'];

  }
  transform(value: any, metadata: ArgumentMetadata) {

    console.log("passo pelo validador de imagem")
    if(!value){
      throw new BadRequestException("Nenhum arquivo foi enviado!")
    }

    this.validateFileSize(value)

    this.validateFileType(value)

    console.log("oiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")

    return value
  }

  private validateFileSize(file: Express.Multer.File){
    if(file.size> this.fileSize){
      console.log("va1")
      throw new BadRequestException(`Tamanho do arquivo excedido. O tamanho máximo permitido é ${this.fileSize}`)
    }
  }

  private validateFileType(file: Express.Multer.File){
    if(!this.fileType.includes(file.mimetype)){
      console.log("va2")
      throw new BadRequestException("Tipo de arquivo não suportado")

    }
  }
}