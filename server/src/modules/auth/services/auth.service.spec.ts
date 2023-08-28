import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ProfileDto } from '../dto/profile.dto';
import { User } from '../../user/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  const mockUserRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };
  
  const userDto: ProfileDto = {
    email: 'test@example.com',
    username: 'ahmed',
    photo: 'ahmed.jpg'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [JwtModule.register({ secret: 'secret' })],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          }, 
        },  
      ],
    }).compile();
  
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });
  
  describe('login', () => {
    it('should return tokens for existing user', async () => {
      const user = new User();
      user.id = "uuid";
      user.email = userDto.email;
      user.username = userDto.username;
      user.photo = userDto.photo;

      jest.spyOn(userRepository, "findOne").mockResolvedValue(user);

      jest.spyOn(jwtService, "sign").mockReturnValue('fakeToken');

      
      const result = await authService.login(userDto);
      console.log("result", result)
      expect(result).toEqual({
        refreshToken: 'fakeToken',
        accessToken: 'fakeToken',
      });
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should create new user and return tokens', async () => {
      const newUser = new User();
      newUser.id = "uuid";
      newUser.email = userDto.email;
      newUser.username = userDto.username;
      newUser.photo = userDto.photo;

      jest.spyOn(userRepository, "findOne").mockResolvedValue(undefined);
      jest.spyOn(userRepository, "create").mockReturnValue(newUser);
      jest.spyOn(userRepository, "save").mockResolvedValue(newUser);
      
      jest.spyOn(jwtService, "sign").mockReturnValue('fakeToken');
      const result = await authService.login(userDto);
      
      expect(result).toEqual({
        refreshToken: 'fakeToken',
        accessToken: 'fakeToken',
      });
      expect(userRepository.save).toHaveBeenCalled();
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token', async () => {
      const decodedToken = { email: 'test@example.com', id: "uuid" };
      const user = new User();
      user.id = 'uuid';
      user.email = decodedToken.email;

      jest.spyOn(jwtService, "verify").mockImplementation(() => Promise.resolve(decodedToken));
      jest.spyOn(userRepository, "findOne").mockResolvedValue(user);
      jest.spyOn(jwtService, "sign").mockReturnValue('fakeToken');

      const newAccessToken = await authService.refreshAccessToken("fakeRefreshToken");

      expect(newAccessToken).toBe('fakeToken');
    });

    it('should throw UnauthorizedException if token verification fails', async () => {
      (jwtService.verify as jest.Mock).mockRejectedValue(new Error())
      await expect(authService.refreshAccessToken('invalidToken')).rejects.toThrowError(
        UnauthorizedException
      );
    });
  });

});
