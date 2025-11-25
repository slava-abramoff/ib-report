import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import {
  CreateIncidentDto,
  PaginationIncident,
} from './dto/create-incident.dto';

@Controller('api/incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  create(@Body() createIncidentDto: CreateIncidentDto) {
    return this.incidentsService.create(createIncidentDto);
  }

  @Get()
  findAll(@Query() p: PaginationIncident) {
    const skip = Number(p.skip);
    const take = Number(p.take);
    const type = p.type ?? null;
    return this.incidentsService.findAll(skip, take, type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIncidentDto: CreateIncidentDto,
  ) {
    return this.incidentsService.update(+id, updateIncidentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incidentsService.remove(+id);
  }
}
