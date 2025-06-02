export interface ApiConfig {
  url: string;
  endpoints: {
    [key: string]: any;
  };
}
