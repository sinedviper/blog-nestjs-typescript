import { TelegramModule } from './../telegram/telegram.module';
import { ReviewModel } from './review.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  controllers: [ReviewController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ReviewModel,
        schemaOptions: {
          collection: 'Review',
        },
      },
    ]),
    TelegramModule,
  ],
  providers: [ReviewService],
})
export class ReviewModule {}
