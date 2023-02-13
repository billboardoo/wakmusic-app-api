import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Entity({ name: 'categories' })
export class CategoriesEntity extends BaseEntity {
  @ApiModelProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @Column()
  type: string;

  @ApiModelProperty()
  @Column('simple-array')
  categories: Array<string>;
}
