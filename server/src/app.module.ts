import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { RolesModule } from './roles/roles.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { PlaylistMusicsModule } from './playlist-musics/playlist-musics.module';
import { MusicModule } from './music/music.module';
import { GenresModule } from './genres/genres.module';
import { CommentsModule } from './comments/comments.module';
import { ArtistsModule } from './artists/artists.module';
import { KsqldbConnectionService } from './ksqldb-connection/ksqldb-connection.service';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { Music } from './music/entities/music.entity';
import { Users } from './users/entities/user.entity';
import { Playlists } from './playlists/entities/playlist.entity';
import { Artists } from './artists/entities/artist.entity';
import { LoggerMiddleware } from './logger.middleware';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWD,
      database: process.env.DB_NAME,
      synchronize: true,
      entities: ['dist/**/entities/*.entity.js'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets'),
      exclude: ['api/*'],
    }),
    TypeOrmModule.forFeature([Music, Users, Playlists, Artists]),
    UsersModule,
    SubscriptionsModule,
    RolesModule,
    PlaylistsModule,
    PlaylistMusicsModule,
    MusicModule,
    GenresModule,
    CommentsModule,
    ArtistsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, KsqldbConnectionService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
