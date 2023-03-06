import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Entity({ name: 'playlist_copy_log' })
export class PlaylistCopyLogEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({ type: 'text' })
  playlist_key: string;

  @ApiModelProperty()
  @Column({ type: 'text' })
  new_playlist_key: string;

  @ApiModelProperty()
  @Column({ type: 'int' })
  created_at: number;
}
