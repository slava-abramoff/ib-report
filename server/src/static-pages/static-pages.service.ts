import { Injectable } from '@nestjs/common';
import { CreateStaticPageDto } from './dto/create-static-page.dto';
import { UpdateStaticPageDto } from './dto/update-static-page.dto';

@Injectable()
export class StaticPagesService {
  create(createStaticPageDto: CreateStaticPageDto) {
    return 'This action adds a new staticPage';
  }

  findAll() {
    return `This action returns all staticPages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} staticPage`;
  }

  update(id: number, updateStaticPageDto: UpdateStaticPageDto) {
    return `This action updates a #${id} staticPage`;
  }

  remove(id: number) {
    return `This action removes a #${id} staticPage`;
  }
}
