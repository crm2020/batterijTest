/**
 * An interface that represent that devices table
 */
export interface Device {
  device_id?: number;
  display_name: string;
  api_key: string;
  description: string;
  motor1: number;
  motor2: number;
  online: boolean;
  image: string;
}
