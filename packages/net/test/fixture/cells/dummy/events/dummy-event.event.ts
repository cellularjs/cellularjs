import { Service, ServiceHandler } from '../../../../../src';

@Service()
export class DummyService implements ServiceHandler {
  async handle() { }
}