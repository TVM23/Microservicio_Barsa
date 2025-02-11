import { Test, TestingModule } from '@nestjs/testing';
import { MueblesController } from './muebles.controller';
import { MueblesService } from './muebles.service';

describe('MueblesController', () => {
  let mueblesController: MueblesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MueblesController],
      providers: [MueblesService],
    }).compile();

    mueblesController = app.get<MueblesController>(MueblesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(mueblesController.getHello()).toBe('Hello World!');
    });
  });
});
