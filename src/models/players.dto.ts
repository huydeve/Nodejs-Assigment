class PlayersDTO {
  name: string;
  image: string;
  club: string;
  position: string;
  goals: string;
  isCaptain: boolean;
  constructor(
    name: string,
    image: string,
    club: string,
    position: string,
    goals: string,
    isCaptain: boolean
  ) {
    this.name = name;
    this.image = image;
    this.club = club;
    this.position = position;
    this.goals = goals;
    this.isCaptain = isCaptain;
  }
}
export default PlayersDTO;
