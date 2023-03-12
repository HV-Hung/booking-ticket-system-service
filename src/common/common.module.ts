import { Module } from '@nestjs/common';
import { DateScalar } from './scalar/date.scalar';

@Module({ providers: [DateScalar], exports: [DateScalar] })
export class CommonModule {}
