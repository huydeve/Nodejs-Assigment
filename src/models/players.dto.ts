class PlayersDTO {
  name: string;
  image: string;
  club: string;
  position: string;
  goals: string;
  isCaptain: boolean;
  nation: string;
  constructor(
    name: string,
    nation: string,
    image: string,
    club: string,
    position: string,
    goals: string,
    isCaptain: boolean
  ) {
    this.name = name;
    this.image = image;
    this.nation = nation;
    this.club = club;
    this.position = position;
    this.goals = goals;
    this.isCaptain = isCaptain;
  }
}
export default PlayersDTO;
