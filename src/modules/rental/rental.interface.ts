export interface IUpdateRentalStatus {
  status: "APPROVED" | "REJECTED";
}

export interface ICreateRental {
  propertyId: string;
  moveInDate: Date;
  rentalMonths: number;
}

export interface IRentalQuery {
  page?: string;
  limit?: string;
}