/** Express Request object augmentation
 * add user defined properties to the Request object
 */
declare namespace Express {
  export interface Request {
    user: {
      id: string;
      email: string;
      role: "SuperAdmin" | "DigitalTeam" | "Customer";
    };
  }
}
