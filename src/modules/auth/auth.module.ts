import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '../../interface/rest/controllers/auth.controller';
import { UserOrm } from '../../infrastructure/orm/entities/user.orm-entity';
import { UserRepositoryTypeOrm } from '../../infrastructure/orm/repositories/user.repository.typeorm';
import { RegisterUseCase } from '../../application/use-cases/auth/register.usecase';
import { LoginUseCase } from '../../application/use-cases/auth/login.usecase';
import { AppLogger } from '../../infrastructure/logger/app-logger';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrm]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AppLogger,
    RegisterUseCase,
    LoginUseCase,
    { provide: 'IUserRepository', useClass: UserRepositoryTypeOrm },
  ],
  exports: ['IUserRepository', JwtModule],
})
export class AuthModule {}
