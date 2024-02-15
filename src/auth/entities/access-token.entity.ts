import { BaseEntity } from 'src/common/entity/base-entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class AccessToken extends BaseEntity {
  @ManyToOne(() => User, (user) => user.accessToken)
  user: Relation<User>;

  @Column()
  jti: string;

  @Column({type: 'timestamp'})
  expiresAt: Date;
}
