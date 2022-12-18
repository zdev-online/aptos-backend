import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [TokenService],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate tokens', async () => {
    const tokens = await service.generateTokens({
      user_id: Math.floor(Math.random() * 1e6),
    });

    expect(tokens).toBeDefined();

    expect(tokens.access_token).toBeDefined();
    expect(tokens.refresh_token).toBeDefined();

    expect(typeof tokens.access_token).toBe('string');
    expect(typeof tokens.refresh_token).toBe('string');
  });
});
