class NationsDTO {
  flagNation: string | undefined;
  name: string | undefined;
  description: string | undefined;
  constructor(
    name: string | undefined,
    description: string | undefined,
    flagNation: string | undefined
  ) {
    this.name = name;
    this.description = description;
    this.flagNation = flagNation;
  }
}
export default NationsDTO;
