import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { NextFunction, Request, Response } from 'express';
import { expressProxy, InputTransform, OutputTransform } from '../../src';
import { Transporter } from '../../src/types';
import { IRQ, IRS } from '@cellularjs/net';

const mockReq: Partial<Request> = {};
const mockRes: Partial<Response> = {};
const mockNext: NextFunction = () => {};

const defaultTransporter: Transporter = {
  async send(irq) {
    if (irq?.body.shouldThrow) {
      throw new IRS({ status: 500 });
    }

    return new IRS({ status: 200 }, { irq });
  },
};

const inputTransform: InputTransform = (req, proxyTo) => {
  return new IRQ(
    { to: proxyTo, corrId: 1 },
    { ...req.query, ...req.params, ...req.body },
  );
};

const outputTransform: OutputTransform = () => {};

function configProxy(
  inputTransform: InputTransform,
  outputTransform: OutputTransform,
  transporter = defaultTransporter,
) {
  return expressProxy(
    {
      inputTransform,
      outputTransform,
    },
    transporter,
  );
}

describe('expressProxy function', () => {
  describe('Proxy config priority', () => {
    it('without subProxyConfig, inputTransform from baseProxyConfig will be invoked', async () => {
      const inputTransform = sinon.spy();

      const proxyTo = configProxy(inputTransform, outputTransform);
      const proxyMiddleware = proxyTo('IAM:GetUserInfo');

      await proxyMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(inputTransform.called).to.be.true;
    });

    it('with subProxyConfig, inputTransform from baseProxyConfig will be ignored', async () => {
      const baseInputTransform = sinon.spy();
      const subInputTransform = sinon.spy();

      const proxyTo = configProxy(baseInputTransform, outputTransform);
      const proxyMiddleware = proxyTo('IAM:GetUserInfo', {
        inputTransform: subInputTransform,
      });

      await proxyMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(baseInputTransform.called).to.be.false;
      expect(subInputTransform.called).to.be.true;
    });

    it('without subProxyConfig, outputTransform from baseProxyConfig will be invoked', async () => {
      const outputTransform = sinon.spy();

      const proxyTo = configProxy(inputTransform, outputTransform);
      const proxyMiddleware = proxyTo('IAM:GetUserInfo');

      await proxyMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(outputTransform.called).to.be.true;
    });

    it('with outputTransform in subProxyConfig, outputTransform from baseProxyConfig will be ignored', async () => {
      const baseOutputTransform = sinon.spy();
      const subOutputTransform = sinon.spy();

      const proxyTo = configProxy(inputTransform, baseOutputTransform);
      const proxyMiddleware = proxyTo('IAM:GetUserInfo', {
        outputTransform: subOutputTransform,
      });

      await proxyMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(baseOutputTransform.called).to.be.false;
      expect(subOutputTransform.called).to.be.true;
    });
  });

  describe('ExpressJS middlewares compatibility', () => {
    it('ExpressContext contain all toolkits for express middleware', async () => {
      const outputTransform: OutputTransform = (expressCtx) => {
        // compile without error => OK
        expressCtx.next;
        expressCtx.req;
        expressCtx.res;
      };

      configProxy(inputTransform, outputTransform);
    });

    it('CellularContext contains irq, irs', async () => {
      const outputTransform: OutputTransform = (_, cellularCtx) => {
        // compile without error => OK
        cellularCtx.irq;
        cellularCtx.irs;
      };

      configProxy(inputTransform, outputTransform);
    });

    it('can use expressCtx.next() for chainable middlewares', async () => {
      const inputTransform = sinon.spy();
      const spyNext = sinon.spy();

      const outputTransform: OutputTransform = (expressCtx) => {
        expressCtx.next();
      };

      const proxyTo = configProxy(inputTransform, outputTransform);
      const proxyMiddleware = proxyTo('IAM:GetUserInfo');

      await proxyMiddleware(mockReq as Request, mockRes as Response, spyNext);

      expect(spyNext.called).to.be.true;
    });
  });

  describe('Error response', () => {
    it('expressProxy can catch throwed error and assign it into irs', async () => {
      let isCatchable = false;
      const inputTransform: InputTransform = (_, proxyTo) => {
        return new IRQ({ to: proxyTo }, { shouldThrow: true });
      };

      const outputTransform: OutputTransform = (_, cellularCtx) => {
        isCatchable = cellularCtx.irs.header.status === 500;
      };

      const proxyTo = configProxy(inputTransform, outputTransform);
      const proxyMiddleware = proxyTo('IAM:GetUserInfo');

      await proxyMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(isCatchable).to.be.true;
    });
  });
});
