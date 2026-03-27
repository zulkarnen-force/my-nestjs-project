import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, LoginDto, RegisterDto, AuthResponse } from './auth.interface';

@Injectable()
export class AuthService {
  private users: Array<{ id: string; username: string; email: string; password: string }> = [];

  constructor(private readonly jwtService: JwtService) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const existingUser = this.users.find(
      (u) => u.username === registerDto.username || u.email === registerDto.email,
    );

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const newUser = {
      id: this.generateId(),
      username: registerDto.username,
      email: registerDto.email,
      password: registerDto.password,
    };

    this.users.push(newUser);

    return this.generateAuthResponse(newUser);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = this.users.find(
      (u) => u.username === loginDto.username && u.password === loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAuthResponse(user);
  }

  async validateUser(payload: JwtPayload): Promise<{ id: string; username: string; email?: string } | null> {
    const user = this.users.find((u) => u.id === payload.sub);
    if (!user) return null;
    return { id: user.id, username: user.username, email: user.email };
  }

  private generateAuthResponse(user: { id: string; username: string; email: string }): AuthResponse {
    const payload: JwtPayload = { sub: user.id, username: user.username, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
