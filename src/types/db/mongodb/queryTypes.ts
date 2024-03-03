import { Document } from "mongoose";
import { DeleteResult } from "mongodb";

type DocumentOrErrorStringified = Document<any, any, any> | string;
type PromiseDocumentOrErrorStringified = Promise<Document<any, any, any> | string>;
type PromiseDocumentArrayOrErrorStringified = Promise<Array<Document<any, any, any>> | string>;
type DocumentArrayOrErrorStringified = Array<Document<any, any, any>> | string;
type PromiseDeleteDocumentOrErrorStringified = Promise<DeleteResult | string>;
type DeleteDocumentOrErrorStringified = DeleteResult | string;

export type { 
    PromiseDocumentOrErrorStringified, 
    DocumentOrErrorStringified, 
    PromiseDocumentArrayOrErrorStringified, 
    PromiseDeleteDocumentOrErrorStringified,
    DeleteDocumentOrErrorStringified,
    DocumentArrayOrErrorStringified,
};