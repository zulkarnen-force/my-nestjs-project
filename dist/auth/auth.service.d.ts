import { JwtService } from '@nestjs/jwt';
import { JwtPayload, LoginDto, RegisterDto, AuthResponse } from './auth.interface';
export declare class AuthService {
    private readonly jwtService;
    private users;
    constructor(jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<AuthResponse>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
    validateUser(payload: JwtPayload): Promise<{
        id: string;
        username: string;
        email?: string;
    } | null>;
    private generateAuthResponse;
    private generateId;
}
