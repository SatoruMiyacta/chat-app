import { atom } from 'jotai';

import { UserData, RoomData, GroupData } from '@/store';

export interface CacheObject {
  data: UserData | GroupData | RoomData | string[];
  expiresIn: Date;
}
