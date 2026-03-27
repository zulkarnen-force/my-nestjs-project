import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.register(registerDto);

      expect(result).toHaveProperty('access_token', 'mock-jwt-token');
      expect(result.user).toHaveProperty('username', 'testuser');
      expect(result.user).toHaveProperty('email', 'test@example.com');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: expect.any(String),
        username: 'testuser',
        email: 'test@example.com',
      });
    });

    it('should throw UnauthorizedException if user already exists', async () => {
      const registerDto = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123',
      };

      await authService.register(registerDto);

      await expect(authService.register(registerDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if email already exists', async () => {
      const registerDto1 = {
        username: 'user1',
        email: 'same@example.com',
        password: 'password123',
      };

      const registerDto2 = {
        username: 'user2',
        email: 'same@example.com',
        password: 'password456',
      };

      await authService.register(registerDto1);

      await expect(authService.register(registerDto2)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      const registerDto = {
        username: 'loginuser',
        email: 'login@example.com',
        password: 'password123',
      };
      await authService.register(registerDto);
    });

    it('should login successfully with valid credentials', async () => {
      const loginDto = {
        username: 'loginuser',
        password: 'password123',
      };

      const result = await authService.login(loginDto);

      expect(result).toHaveProperty('access_token', 'mock-jwt-token');
      expect(result.user).toHaveProperty('username', 'loginuser');
    });

    it('should throw UnauthorizedException with invalid password', async () => {
      const loginDto = {
        username: 'loginuser',
        password: 'wrongpassword',
      };

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException with non-existent user', async () => {
      const loginDto = {
        username: 'nonexistent',
        password: 'password123',
      };

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user when payload is valid', async () => {
      const registerDto = {
        username: 'validateuser',
        email: 'validate@example.com',
        password: 'password123',
      };

      const registered = await authService.register(registerDto);
      const payload = { sub: registered.user.id, username: 'validateuser' };

      const result = await authService.validateUser(payload);

      expect(result).toHaveProperty('username', 'validateuser');
    });

    it('should return null when user not found', async () => {
      const payload = { sub: 'non-existent-id', username: 'nonexistent' };

      const result = await authService.validateUser(payload);

      expect(result).toBeNull();
    });
  });
});
