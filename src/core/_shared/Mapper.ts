import Result from './UseCaseResult';

export default abstract class Mapper<DOMAIN, DTO> {
  public abstract fromDTOToDomain(dto: DTO): Result<DOMAIN>;
  public abstract fromPersistenceToDomain(raw: any): DOMAIN | null;
  public abstract toPersistence(domain: DOMAIN): any;
  public abstract toDTO(domain: DOMAIN): DTO;
}
