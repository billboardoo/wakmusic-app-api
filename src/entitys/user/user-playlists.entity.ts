import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Entity({ name: 'user_playlists' })
export class UserPlaylistsEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({ type: 'text' })
  user_id: string;

  @ApiModelProperty()
  @Column({ type: 'simple-array' })
  playlists: Array<string>;
}
