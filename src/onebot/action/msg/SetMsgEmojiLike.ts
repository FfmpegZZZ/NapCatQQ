import { ActionName } from '@/onebot/action/router';
import { OneBotAction } from '@/onebot/action/OneBotAction';
import { MessageUnique } from '@/common/message-unique';
import { z } from 'zod';

const SchemaData = z.object({
    message_id: z.coerce.string(),
    emoji_id: z.coerce.string(),
    set: z.coerce.boolean().optional(),
});

type Payload = z.infer<typeof SchemaData>;

export class SetMsgEmojiLike extends OneBotAction<Payload, unknown> {
    override actionName = ActionName.SetMsgEmojiLike;
    override payloadSchema = SchemaData;

    async _handle(payload: Payload) {
        const msg = MessageUnique.getMsgIdAndPeerByShortId(+payload.message_id);
        if (!msg) {
            throw new Error('msg not found');
        }
        if (!payload.emoji_id) {
            throw new Error('emojiId not found');
        }
        payload.set = payload.set ?? true;

        const msgData = (await this.core.apis.MsgApi.getMsgsByMsgId(msg.Peer, [msg.MsgId])).msgList;
        if (!msgData || msgData.length === 0 || !msgData[0]?.msgSeq) {
            throw new Error('find msg by msgid error');
        }

        return await this.core.apis.MsgApi.setEmojiLike(
            msg.Peer,
            msgData[0].msgSeq,
            payload.emoji_id.toString(),
            typeof payload.set === 'string' ? payload.set === 'true' : !!payload.set
        );
    }
}