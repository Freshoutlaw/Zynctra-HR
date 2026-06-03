export abstract class BaseConnector {{
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
}}
