// Type definition for server action responses
export type ServerActionResponse<T = undefined> = 
  | { success: true; data?: T; message?: string }
  | { success: false; error: string; message?: string }; 