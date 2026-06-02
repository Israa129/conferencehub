export class SessionConference {
  constructor(
    public id: number,
    public titre: string,
    public type: string,
    public horaireDebut: Date,
    public horaireFin: Date,
    public capacite: number,
    public conferenceId: number
  ) {}
}