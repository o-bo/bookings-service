import { IGuardResult } from './Guard';
import Result from './Result';

export default abstract class Mapper<DOMAIN, DTO> {
  public abstract fromDtoToDomain(dto: DTO): Result<IGuardResult, DOMAIN>;
  public abstract fromPersistenceToDomain(raw: any): DOMAIN | null;
  public abstract fromDomainToPersistence(domain: DOMAIN): any;
  public abstract fromDomainToDto(domain: DOMAIN): DTO;
}
