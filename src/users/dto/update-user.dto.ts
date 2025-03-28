import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  readonly username?: string;

  @IsOptional()
  @IsString()
  readonly bio?: string;
}
