/* eslint-disable @typescript-eslint/no-var-requires */
import type { IVideoConferenceUser } from '@rocket.chat/apps-engine/definition/videoConferences/IVideoConferenceUser';
import type {
    IVideoConfProvider,
    VideoConfData,
    VideoConfDataExtended,
    IVideoConferenceOptions,
} from '@rocket.chat/apps-engine/definition/videoConfProviders';

export class UnconfiguredVideoConfProvider implements IVideoConfProvider {
    public name = 'unconfigured'

    public capabilities = {
        mic: false,
        cam: false,
        title: false,
        persistentChat: false,
    }

    public async isFullyConfigured(): Promise<boolean> {
        return false;
    }

    public async generateUrl(call: VideoConfData): Promise<string> {
        return `unconfigured/${call._id}`;
    }

    public async customizeUrl(call: VideoConfDataExtended, user: IVideoConferenceUser, options: IVideoConferenceOptions): Promise<string> {
        return call.url;
    }
}
