import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DocsModule } from './docs/docs.module';
import { EventsModule } from './events/events.module';
import { IncidentsModule } from './incidents/incidents.module';
import { StaticPagesModule } from './static-pages/static-pages.module';

@Module({
  imports: [UsersModule, AuthModule, DocsModule, EventsModule, IncidentsModule, StaticPagesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
