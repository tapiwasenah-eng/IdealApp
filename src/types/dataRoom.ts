export interface DataRoomPermissions {
  hasPassword: boolean;
  password?: string;
  expiresAt?: string | null;
  allowDownload: boolean;
  requireNDA: boolean;
}

export const defaultPermissions: DataRoomPermissions = {
  hasPassword: false,
  allowDownload: false,
  requireNDA: false,
};
