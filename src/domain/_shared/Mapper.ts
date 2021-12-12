import UseCaseResult from './UseCaseResult';

export default abstract class Mapper<DOMAIN, DTO> {
  public abstract fromDtoToDomain(dto: DTO): UseCaseResult<DOMAIN>;
  public abstract fromPersistenceToDomain(raw: any): DOMAIN | null;
  public abstract toPersistence(domain: DOMAIN): any;
  public abstract toDTO(domain: DOMAIN): DTO;
}
