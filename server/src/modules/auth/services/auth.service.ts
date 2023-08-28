import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from "typeorm"
import { User } from '../../user/entities/user.entity';
import {  ProfileDto } from '../dto/profile.dto';
import { JwtService } from "@nestjs/jwt"
import { Role } from '../../../common/enums/Role.enum';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository : Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(userPofile: ProfileDto): Promise<any> {
    console.log(userPofile)
    let user = await this.userRepository.findOne({ where: { email: userPofile.email } });
    
    if (!user) 
      user = await this.userRepository.save(this.userRepository.create(userPofile));
    
    let refreshToken = await this.generateRefreshToken(user.id, user.email);
    let accessToken = await this.generateAccessToken(user.id, user.email);
    
    return {
      refreshToken,
      accessToken
    };
  }

  async refreshAccessToken(refreshToken: string) : Promise<string> {
    try {
      const decoded = await this.jwtService.verify(refreshToken);

      const user = await this.userRepository.findOne({ where: { email: decoded.email } });

      if (user) {
        const newAccessToken = await this.generateAccessToken(user.id, user.email);
        return newAccessToken;
      }
    } catch(error) {
      throw new UnauthorizedException()
    }
  }

  private async generateAccessToken(id: string, email: string) : Promise<string> { 
    return await this.jwtService.sign({ role: Role.USER , email: email, id }, { expiresIn: '7d' });
  }
  private async generateRefreshToken(id: string, email: string) : Promise<string> { 
    return await this.jwtService.sign({ role: Role.USER , email: email, id }, { expiresIn: '7d' });
  }
}
