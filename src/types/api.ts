/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T = any> {
  success: boolean;
  status: number;
  message: string;
  data: T;
  paginate: any;
}

export interface ApiErrorResponse {
  success: false;
  status: number;
  message: string;
  data: null;
  paginate: null;
}
