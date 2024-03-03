import { Model } from "mongoose";

interface DBModel {
    USER: Model<any>
    CHAT: Model<any>,
    GROUP: Model<any>
};

export type { DBModel };