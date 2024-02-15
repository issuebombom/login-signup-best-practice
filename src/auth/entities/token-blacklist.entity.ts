import { BaseEntity } from 'src/common/entity/base-entity';
import { Column, Entity } from 'typeorm';

export type TokenType = 'access' | 'refresh';

@Entity()
export class TokenBlacklist extends BaseEntity {
  @Column()
  jti: string;

  @Column()
  tokenType: TokenType;

  @Column({ type: 'timestamp' })
  expiresAt: Date;
}
