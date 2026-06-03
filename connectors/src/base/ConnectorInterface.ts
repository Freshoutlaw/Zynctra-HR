export interface ConnectorInterface {{
  connect(): Promise<void>;
  sync(): Promise<any>;
}}
