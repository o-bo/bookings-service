import * as express from 'express';
import UseCaseError from '../error/UseCaseError';

export default abstract class RestExpressAdapter<DTO, ENT, ERR> {
  // or even private
  protected req!: express.Request;

  protected res!: express.Response;

  protected next!: express.NextFunction;

  protected _error?: ERR;

  protected resultEntity?: ENT;

  protected abstract concreteError(error?: ERR): any;
  protected error(error?: ERR): any {
    this._error = error;
    return this.concreteError(this._error);
  }

  protected abstract concreteResponse(resultEntity?: ENT): any;
  protected response(resultEntity?: ENT): any {
    this.resultEntity = resultEntity;
    return this.concreteResponse(this.resultEntity);
  }

  protected abstract concreteExecute(params: DTO): void;
  public execute(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void {
    this.req = req;
    this.res = res;
    this.next = next;

    const params = {
      ...this.req.query,
      ...this.req.params,
      ...this.req.body
    };

    this.concreteExecute(params);
  }

  public static jsonResponse(
    res: express.Response,
    code: number,
    result?: any
  ) {
    return result ? res.status(code).json(result) : res.sendStatus(code);
  }

  public ok(dto?: DTO) {
    return RestExpressAdapter.jsonResponse(this.res, 200, dto);
  }

  public created(dto?: DTO) {
    return RestExpressAdapter.jsonResponse(this.res, 201, dto);
  }

  public clientError(error?: UseCaseError) {
    return RestExpressAdapter.jsonResponse(
      this.res,
      400,
      error ? error : { message: 'Client Error' }
    );
  }

  public unauthorized(error?: UseCaseError) {
    return RestExpressAdapter.jsonResponse(
      this.res,
      401,
      error ? error : { message: 'Unauthorized' }
    );
  }

  public paymentRequired(error?: UseCaseError) {
    return RestExpressAdapter.jsonResponse(
      this.res,
      402,
      error ? error : { message: 'Payment required' }
    );
  }

  public forbidden(error?: UseCaseError) {
    return RestExpressAdapter.jsonResponse(
      this.res,
      403,
      error ? error : { message: 'Forbidden' }
    );
  }

  public notFound(error?: UseCaseError) {
    return RestExpressAdapter.jsonResponse(
      this.res,
      404,
      error ? error : { message: 'Not found' }
    );
  }

  public conflict(error?: UseCaseError) {
    return RestExpressAdapter.jsonResponse(
      this.res,
      409,
      error ? error : { message: 'Conflict' }
    );
  }

  public tooMany(error?: UseCaseError) {
    return RestExpressAdapter.jsonResponse(
      this.res,
      429,
      error ? error : { message: 'Too many requests' }
    );
  }

  public unprocessable(error?: UseCaseError) {
    return RestExpressAdapter.jsonResponse(
      this.res,
      422,
      error ? error : { message: 'Unprocessable entity' }
    );
  }

  public todo() {
    return RestExpressAdapter.jsonResponse(this.res, 400, { message: 'TODO' });
  }

  public fail(error?: Error | any) {
    return RestExpressAdapter.jsonResponse(this.res, 500, {
      result: error?.toString()
    });
  }
}
