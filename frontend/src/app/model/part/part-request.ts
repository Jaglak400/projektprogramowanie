export class PartRequest {
  constructor(
    public name: string,
    public amount?: number,
    public price?: number,
    public id?: number
  ) {}
}
