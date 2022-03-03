export default abstract class Mapper<DOMAIN, DTO> {
  public abstract fromPersistenceToDto(raw: any): DTO;
  public abstract fromDomainToPersistence(domain: DOMAIN): any;
  public abstract fromDomainToDto(domain: DOMAIN): DTO;
}
