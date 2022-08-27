import { HhModule } from './../hh/hh.module';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { Module } from '@nestjs/common';

import { TopPageController } from './top-page.controller';
import { TopPageModel } from './top-page.model';
import { TopPageService } from './top-page.service';

@Module({
  controllers: [TopPageController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: TopPageModel,
        schemaOptions: {
          collection: 'TopPage',
        },
      },
    ]),
    ConfigModule,
    HhModule,
  ],
  providers: [TopPageService],
  exports: [TopPageService],
})
export class TopPageModule {}
