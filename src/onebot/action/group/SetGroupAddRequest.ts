import { OneBotAction } from '@/onebot/action/OneBotAction';
import { NTGroupRequestOperateTypes } from '@/core/types';
import { ActionName } from '@/onebot/action/router';
import { z } from 'zod';

const SchemaData = z.object({
    flag: z.coerce.string(),
    approve: z.coerce.boolean().default(true),
    reason: z.coerce.string().nullable().default(' '),
});

type Payload = z.infer<typeof SchemaData>;

export default class SetGroupAddRequest extends OneBotAction<Payload, null> {
    override actionName = ActionName.SetGroupAddRequest;
    override payloadSchema = SchemaData;

    async _handle(payload: Payload): Promise<null> {
        const flag = payload.flag.toString();
        const approve = payload.approve?.toString() !== 'false';
        const reason = payload.reason ?? ' ';
        const invite_notify = this.obContext.apis.MsgApi.notifyGroupInvite.get(flag);
        const { doubt, notify } = invite_notify ? { doubt: false, notify: invite_notify } : await this.findNotify(flag);
        if (!notify) {
            throw new Error('No such request');
        }
        await this.core.apis.GroupApi.handleGroupRequest(
            doubt,
            notify,
            approve ? NTGroupRequestOperateTypes.KAGREE : NTGroupRequestOperateTypes.KREFUSE,
            reason,
        );
        return null;
    }

    private async findNotify(flag: string) {
        let notify = (await this.core.apis.GroupApi.getSingleScreenNotifies(false, 100)).find(e => e.seq == flag);
        if (!notify) {
            notify = (await this.core.apis.GroupApi.getSingleScreenNotifies(true, 100)).find(e => e.seq == flag);
            return { doubt: true, notify };
        }
        return { doubt: false, notify };
    }
}