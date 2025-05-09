import { OneBotAction } from '@/onebot/action/OneBotAction';
import { ActionName } from '@/onebot/action/router';
import { ChatType } from '@/core';
import { z } from 'zod';

const SchemaData = z.object({
    user_id: z.coerce.string(),
    event_type: z.coerce.number(),
});

type Payload = z.infer<typeof SchemaData>;

export class SetInputStatus extends OneBotAction<Payload, unknown> {
    override actionName = ActionName.SetInputStatus;
    override payloadSchema = SchemaData;
    async _handle(payload: Payload) {
        const uid = await this.core.apis.UserApi.getUidByUinV2(payload.user_id.toString());
        if (!uid) throw new Error('uid is empty');
        const peer = {
            chatType: ChatType.KCHATTYPEC2C,
            peerUid: uid,
        };
        return await this.core.apis.MsgApi.sendShowInputStatusReq(peer, payload.event_type);
    }
}
