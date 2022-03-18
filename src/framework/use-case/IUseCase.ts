export default interface IUseCase<RQST, RSPS> {
  execute(request?: RQST): Promise<RSPS> | RSPS;
}
