
import { OneBotAction } from '@/onebot/action/OneBotAction';
import { ActionName } from '@/onebot/action/router';
import { OB11Construct } from '@/onebot/helper/data';
import { z } from 'zod';

const SchemaData = z.object({
    group_id: z.coerce.string(),
    folder_id: z.coerce.string().optional(),
    folder: z.coerce.string().optional(),
    file_count: z.coerce.number().default(50),
});

type Payload = z.infer<typeof SchemaData>;

export class GetGroupFilesByFolder extends OneBotAction<Payload, {
    files: ReturnType<typeof OB11Construct.file>[],
    folders: never[],
}> {
    override actionName = ActionName.GoCQHTTP_GetGroupFilesByFolder;
    override payloadSchema = SchemaData;
    async _handle(payload: Payload) {

        const ret = await this.core.apis.MsgApi.getGroupFileList(payload.group_id.toString(), {
            sortType: 1,
            fileCount: +payload.file_count,
            startIndex: 0,
            sortOrder: 2,
            showOnlinedocFolder: 0,
            folderId: payload.folder ?? payload.folder_id ?? '',
        }).catch(() => []);
        return {
            files: ret.filter(item => item.fileInfo)
                .map(item => OB11Construct.file(item.peerId, item.fileInfo!)),
            folders: [] as [],
        };
    }
}
