class PlayersDTO {
  name: string | undefined;
  image: string | undefined;
  club: string | undefined;
  position: string | undefined;
  goals: string | undefined;
  isCaptain: boolean | undefined;
  constructor(
    name: string | undefined,
    image: string | undefined,
    club: string | undefined,
    position: string | undefined,
    goals: string | undefined,
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
