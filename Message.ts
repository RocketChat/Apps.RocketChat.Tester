import { IMessage, IMessageAttachment } from '@rocket.chat/apps-engine/definition/messages';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';

export class Message implements IMessage{
    text?: string;
    sender: IUser;
    room: IRoom;
    attachments?: Array<IMessageAttachment>;

    customFields?: {
        [key: string]: any;
    };

    constructor(sender: IUser, room: IRoom, text?: string){
        this.sender = sender;
        this.room = room;
        this.text = text;

        if (!Array.isArray(this.attachments)) {
            this.attachments = new Array<IMessageAttachment>();
        }
    }

    public addCustomField(key: string, value: any) {
        if (!this.customFields) {
            this.customFields = {};
        }

        if (this.customFields[key]) {
            throw new Error(`The message already contains a custom field by the key: ${ key }`);
        }

        this.customFields[key] = value;
    }

    public addAttachment(attachment: IMessageAttachment) {
        this.attachments!!.push(attachment);

        return this;
    }
}