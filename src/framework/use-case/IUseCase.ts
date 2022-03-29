import Result from '../result/Result';

export default interface IUseCase<RQST, ERR, RSPS> {
  handle(request?: RQST): Promise<Result<ERR, RSPS>>;
}
