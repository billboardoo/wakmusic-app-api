import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'artist' })
export class ArtistVersionEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column({ type: 'text', unique: true })
  artist: string;

  @ApiModelProperty()
  @Column({ type: 'int' })
  round: number;

  @ApiModelProperty()
  @Column({ type: 'int' })
  square: number;
}
