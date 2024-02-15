import { BaseEntity } from 'src/common/entity/base-entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class RefreshToken extends BaseEntity {
  @ManyToOne(() => User, (user) => user.refreshToken)
  user: Relation<User>;

  @Column()
  jti: string;

  @Column({type: 'timestamp'})
  expiresAt: Date;
}
