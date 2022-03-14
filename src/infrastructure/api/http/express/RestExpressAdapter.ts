import * as express from 'express';
import UseCaseError from '../../../../framework/UseCaseError';

export default abstract class RestExpressAdapter<DTO, ENT, ERR> {
  // or even private
  protected req!: express.Request;

  protected res!: express.Response;

  protected error!: ERR;

  protected resultEntity!: ENT;

  protected abstract processErrorImpl(error: ERR): any;
  protected processError(error: ERR): any {
    this.error = error;
    return this.processErrorImpl(this.error);
  }

  protected abstract processResultImpl(resultEntity: ENT): any;
  protected processResult(resultEntity: ENT): any {
    this.resultEntity = resultEntity;
    return this.processResultImpl(this.resultEntity);
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

  public fail(error: Error | any) {
    console.log(error);
    return RestExpressAdapter.jsonResponse(this.res, 500, {
      result: error.toString()
    });
  }
}
