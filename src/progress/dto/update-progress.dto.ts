import { IsNotEmpty, IsNumber, Min, Max, IsEnum } from 'class-validator';
import { ModuleType } from '../../utils/types';

export class UpdateProgressDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  readonly progress: number;

  @IsNotEmpty()
  @IsEnum(ModuleType)
  readonly moduleType: ModuleType;
}
