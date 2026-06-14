export class SessionConference {
  constructor(
    public id: number,
    public titre: string,
    public type: string,
    public horaireDebut: Date | string,
    public horaireFin: Date | string,
    public capacite: number,
    public conferenceId: number
  ) {}
}