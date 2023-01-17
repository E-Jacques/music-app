import { Test, TestingModule } from '@nestjs/testing';
import { KsqldbConnectionService } from './ksqldb-connection.service';

describe('KsqldbConnectionService', () => {
  let service: KsqldbConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KsqldbConnectionService],
    }).compile();

    service = module.get<KsqldbConnectionService>(KsqldbConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
