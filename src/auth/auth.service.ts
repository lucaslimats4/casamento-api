import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly adminPassword: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Senha padrão ou da variável de ambiente
    this.adminPassword = this.configService.get<string>('ADMIN_PASSWORD') || 'admin123';
  }

  async validatePassword(password: string): Promise<boolean> {
    // Para simplicidade, comparação direta. Em produção, use hash
    return password === this.adminPassword;
  }

  async login(password: string) {
    const isValid = await this.validatePassword(password);
    
    if (!isValid) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const payload = { 
      sub: 'admin', 
      username: 'admin',
      role: 'admin',
      iat: Math.floor(Date.now() / 1000)
    };

    return {
      access_token: this.jwtService.sign(payload),
      expires_in: 86400, // 24 horas em segundos
      token_type: 'Bearer',
    };
  }

  async validateToken(payload: any) {
    // Validação simples do payload do JWT
    if (payload.sub === 'admin' && payload.role === 'admin') {
      return { 
        id: payload.sub, 
        username: payload.username, 
        role: payload.role 
      };
    }
    return null;
  }
}