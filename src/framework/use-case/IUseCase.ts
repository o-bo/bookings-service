import Result from '../result/Result';

export default interface IUseCase<RQST, ERR, RSPS> {
  result(request?: RQST): Promise<Result<ERR, RSPS>>;
}
