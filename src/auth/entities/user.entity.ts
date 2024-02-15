import { BaseEntity } from 'src/common/entity/base-entity';
import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { AccessToken } from './access-token.entity';
import { RefreshToken } from './refresh-token.entity';

export type UserRole = 'admin' | 'user';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  role: UserRole;

  @OneToMany(() => AccessToken, (token) => token.user)
  accessToken: Relation<AccessToken[]>;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshToken: Relation<RefreshToken[]>;
}
