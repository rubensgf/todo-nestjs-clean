import { Controller, Post, Body } from '@nestjs/common';
import { RegisterUseCase } from '../../../application/use-cases/auth/register.usecase';
import { LoginUseCase } from '../../../application/use-cases/auth/login.usecase';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUC: RegisterUseCase,
    private readonly loginUC: LoginUseCase,
  ) {}

  @ApiOperation({ summary: 'Registrar usuário (público)' })
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.registerUC.execute(body.email, body.password);
  }

  @ApiOperation({ summary: 'Login (público): retorna JWT' })
  @Post('login')
  async login(@Body() body: CreateUserDto) {
    return this.loginUC.execute(body.email, body.password);
  }
}
