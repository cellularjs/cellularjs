import { Server } from 'http';
import { Agent } from 'supertest';

declare global {
  var server: Server;
  var testAgent: Agent;
}
