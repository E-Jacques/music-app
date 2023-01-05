import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comments } from '@/comments/entities/comment.entity';
import { Users } from '@/users/entities/user.entity';
import { Artists } from '@/artists/entities/artist.entity';
import { Genres } from '@/genres/entities/genre.entity';
import { Playlistmusic } from '@/playlist-musics/entities/playlist-music.entity';

@Index('music_pkey', ['musicid'], { unique: true })
@Entity('music', { schema: 'public' })
export class Music {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'musicid' })
  musicid: number;

  @Column('character varying', { name: 'title', length: 45 })
  title: string;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('timestamp without time zone', { name: 'publicationdate' })
  publicationdate: Date;

  @Column('boolean', {
    name: 'turnoffcomments',
    nullable: true,
    default: () => 'false',
  })
  turnoffcomments: boolean | null;

  @Column('text', { name: 'link' })
  link: string;

  @Column('time without time zone', { name: 'duration' })
  duration: string;

  @OneToMany(() => Comments, (comments) => comments.music)
  comments: Comments[];

  @ManyToOne(() => Users, (users) => users.music, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'userid', referencedColumnName: 'userid' }])
  user: Users;

  @ManyToMany(() => Artists, (artists) => artists.music)
  artists: Artists[];

  @ManyToMany(() => Genres, (genres) => genres.music)
  genres: Genres[];

  @OneToMany(() => Playlistmusic, (playlistmusic) => playlistmusic.music)
  playlistmusics: Playlistmusic[];
}
