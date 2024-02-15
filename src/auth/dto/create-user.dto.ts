import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}
