/* eslint-disable @typescript-eslint/no-var-requires */
import type { IVideoConferenceUser } from '@rocket.chat/apps-engine/definition/videoConferences/IVideoConferenceUser';
import type {
    IVideoConfProvider,
    VideoConfData,
    VideoConfDataExtended,
    IVideoConferenceOptions,
} from '@rocket.chat/apps-engine/definition/videoConfProviders';

export class PermanentChatVideoConfProvider implements IVideoConfProvider {
    public name = 'permanentChat'

    public capabilities = {
        mic: true,
        cam: true,
        title: false,
        permanentChat: true,
    }

    public async isFullyConfigured(): Promise<boolean> {
        return true;
    }

    public async generateUrl(call: VideoConfData): Promise<string> {
        return `test/${call.type}/${call._id}/${call.discussionRid || 'none'}`;
    }

    public async customizeUrl(call: VideoConfDataExtended, user: IVideoConferenceUser, options: IVideoConferenceOptions): Promise<string> {
        const { url } = call;

        const uid = user ? `/${user._id}` : '';
        const cam = options.cam ? '/cam' : '';
        const mic = options.mic ? '/mic' : '';

        return `${url}${uid}${cam}${mic}`;
    }
}
