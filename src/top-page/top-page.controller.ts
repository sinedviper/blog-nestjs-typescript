import { HhService } from './../hh/hh.service';
import { NOT_FOUND_TOP_PAGE_ERROR } from './top-page.constants';
import { IdValidationPipe } from './../pipes/ad-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';

import { TopPageService } from './top-page.service';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageModel } from './top-page.model';
import { JwtAuthGuard } from 'src/auth/guards/guard.jwt';

@Controller('top-page')
export class TopPageController {
  constructor(
    private readonly topPageService: TopPageService,
    private readonly hhService: HhService,
    private readonly scheduleRegistry: SchedulerRegistry,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const page = await this.topPageService.findById(id);
    if (!page) {
      throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
    }
    return page;
  }

  @Get('byAlias/:alias')
  async getAlias(@Param('alias') alias: string): Promise<TopPageModel> {
    const page = await this.topPageService.findByAlias(alias);
    if (!page) {
      throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
    }
    return page;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const page = await this.topPageService.deleteById(id);
    if (!page) {
      throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    const page = await this.topPageService.updateById(id, dto);
    if (!page) {
      throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
    }
    return page;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto.firstCategory);
  }

  @Get('textSearch/:text')
  async textSearch(@Param('text') text: string) {
    return this.topPageService.findByAlias(text);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'test' })
  @Get('test')
  async test() {
    //const job = this.scheduleRegistry.getCronJob('test');
    const data = await this.topPageService.findForHhUpdate(new Date());
    for (const page of data) {
      const hhData = await this.hhService.getData(page.category);
      page.hh = hhData;
      await this.topPageService.updateById(page._id, page);
    }
  }
}
