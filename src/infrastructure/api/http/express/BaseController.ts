import * as express from 'express';
import { injectable } from 'inversify';

import UseCaseResult from '../../../../domain/_shared/UseCaseResult';
@injectable()
export default abstract class BaseController<DTO, ENT, ERR> {
  // or even private
  protected req!: express.Request;

  protected res!: express.Response;

  protected useCaseError!: ERR;

  protected useCaseResult!: UseCaseResult<ENT>;

  protected abstract processErrorImpl(error: ERR): any;
  protected processError(error: ERR): any {
    this.useCaseError = error;
    return this.processErrorImpl(this.useCaseError);
  }

  protected abstract processResultImpl(useCaseResult: UseCaseResult<ENT>): any;
  protected processResult(useCaseResult: UseCaseResult<ENT>): any {
    this.useCaseResult = useCaseResult;
    return this.processResultImpl(this.useCaseResult);
  }

  protected abstract executeImpl(params: DTO): Promise<void | any>;
  public execute(
    req: express.Request,
    res: express.Response
  ): Promise<void | any> {
    this.req = req;
    this.res = res;

    const params = {
      ...this.req.query,
      ...this.req.params,
      ...this.req.body
    };

    return this.executeImpl(params);
  }

  public static jsonResponse(
    res: express.Response,
    code: number,
    result?: any
  ) {
    return result ? res.status(code).json(result) : res.sendStatus(code);
  }

  public ok(dto?: DTO) {
    return BaseController.jsonResponse(this.res, 200, dto);
  }

  public created(dto?: DTO) {
    return BaseController.jsonResponse(this.res, 201, dto);
  }

  public clientError(result?: any) {
    return BaseController.jsonResponse(
      this.res,
      400,
      result ? result : { message: 'Client Error' }
    );
  }

  public unauthorized(result?: any) {
    return BaseController.jsonResponse(
      this.res,
      401,
      result ? result : { message: 'Unauthorized' }
    );
  }

  public paymentRequired(result?: any) {
    return BaseController.jsonResponse(
      this.res,
      402,
      result ? result : { message: 'Payment required' }
    );
  }

  public forbidden(result?: any) {
    return BaseController.jsonResponse(
      this.res,
      403,
      result ? result : { message: 'Forbidden' }
    );
  }

  public notFound(result?: any) {
    return BaseController.jsonResponse(
      this.res,
      404,
      result ? result : { message: 'Not found' }
    );
  }

  public conflict(result?: any) {
    return BaseController.jsonResponse(
      this.res,
      409,
      result ? result : { message: 'Conflict' }
    );
  }

  public tooMany(result?: any) {
    return BaseController.jsonResponse(
      this.res,
      429,
      result ? result : { message: 'Too many requests' }
    );
  }

  public unprocessable(result?: any) {
    return BaseController.jsonResponse(
      this.res,
      422,
      result ? result : { message: 'Unprocessable entity' }
    );
  }

  public todo() {
    return BaseController.jsonResponse(this.res, 400, { message: 'TODO' });
  }

  public fail(error: Error | any) {
    console.log(error);
    return this.res.status(500).json({
      result: error.toString()
    });
  }
}
