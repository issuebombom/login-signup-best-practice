import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'issuebombom',
    description: '사용자 이름',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'apple@gmail.com',
    description: '사용자 이메일',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'asdfASDF1234!@',
    description: '사용자 비밀번호',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(9)
  password: string;

  @ApiProperty({
    example: '010-1234-5678',
    description: '사용자 전화번호',
    required: true,
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'user | admin',
    description: '사용자 권한',
  })
  @IsIn(['user', 'admin'])
  role: UserRole;
}
