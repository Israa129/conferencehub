export class Conference {
 constructor(
    public titre: string,
    public description: string,
    public theme: string,
    public lieu: string,
    public date_debut: Date,
    public date_fin: Date,
    public id: number,
    public organisateur_id: number
  ) {}
}