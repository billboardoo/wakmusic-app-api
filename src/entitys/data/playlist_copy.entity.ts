import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Entity({ name: 'playlist_copy' })
export class PlaylistCopyEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({ type: 'int' })
  date: number;

  @ApiModelProperty()
  @Column({ type: 'text' })
  playlist_key: string;

  @ApiModelProperty()
  @Column({ type: 'int' })
  count: number;
}
