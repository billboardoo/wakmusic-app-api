import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Entity({ name: 'playlist' })
export class RecommendPlaylistEntity extends BaseEntity {
  @ApiModelProperty({ description: '플레이리스트 Id', uniqueItems: true })
  @PrimaryColumn({ unique: true })
  id: string;

  @ApiModelProperty({ description: '플레이리스트 이름' })
  @Column()
  title: string;

  @ApiModelProperty({ description: '플레이리스트 노래 목록' })
  @Column('simple-array', {})
  song_ids: Array<string>;

  @ApiModelProperty({ description: '플레이리스트 공개 여부' })
  @Column('boolean')
  public: boolean;
}
