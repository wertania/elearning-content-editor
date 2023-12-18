export interface BaseDataService {
  initialize(): void;

  uploadMedium(): Promise<any>;
  uploadDocument(): Promise<any>;
}
