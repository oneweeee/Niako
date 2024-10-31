import { HttpException, HttpStatus, MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from "multer";
import { v4 as uuid } from "uuid";
import { extname } from "path";
import { UploadMiddleware } from './upload.middleware';
import { ImagesController } from "./images.controller";
import { ImagesService } from "./images.service";

@Module(
    {
        controllers: [ ImagesController ],
        providers: [ ImagesService ],
        imports: [
            MulterModule.register(
                {
                    limits: {
                        fileSize: 1024 * 1024 * 10
                    },
                    fileFilter: (req: any, file: any, cb: any) => {
                        if(file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                            cb(null, true);
                        } else {
                            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
                        }
                    },
                    storage: diskStorage({
                        destination: 'assets/banner/',
                        filename: (req: any, file: any, cb: any) => {
                            cb(null, `${uuid()}${extname(file.originalname)}`);
                        }
                    })
                }
            ),
            ServeStaticModule.forRoot({
                rootPath: `${__dirname}/../../../../assets/`
            })
        ]
    }
)
export class ImagesModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(UploadMiddleware).forRoutes(
            { path: 'public/images/upload', method: RequestMethod.POST }
        )
    }
}