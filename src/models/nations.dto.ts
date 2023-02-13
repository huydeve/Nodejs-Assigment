class NationsDTO {
  flagNation: string;
  name: string;
  description: string;
  constructor(name: string, description: string, flagNation: string) {
    this.name = name;
    this.description = description;
    this.flagNation = flagNation;
  }
}
export default NationsDTO;
