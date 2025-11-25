import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StaticPagesService } from './static-pages.service';
import { CreateStaticPageDto } from './dto/create-static-page.dto';
import { UpdateStaticPageDto } from './dto/update-static-page.dto';

@Controller('static-pages')
export class StaticPagesController {
  constructor(private readonly staticPagesService: StaticPagesService) {}

  @Post()
  create(@Body() createStaticPageDto: CreateStaticPageDto) {
    return this.staticPagesService.create(createStaticPageDto);
  }

  @Get()
  findAll() {
    return this.staticPagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staticPagesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStaticPageDto: UpdateStaticPageDto,
  ) {
    return this.staticPagesService.update(+id, updateStaticPageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staticPagesService.remove(+id);
  }
}
