export interface ComplaintResponse {
  id: number;
  description: string;
  service: {
    id: number;
    name: string;
  };
  status: string;
}
