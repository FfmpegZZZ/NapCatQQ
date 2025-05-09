import { ActionName } from '@/onebot/action/router';
import { GetPacketStatusDepends } from '@/onebot/action/packet/GetPacketStatus';
import { z } from 'zod';

const SchemaData = z.object({
    user_id: z.coerce.number(),
});

type Payload = z.infer<typeof SchemaData>;

export class GetUserStatus extends GetPacketStatusDepends<Payload, { status: number; ext_status: number; } | undefined> {
    override actionName = ActionName.GetUserStatus;
    override payloadSchema = SchemaData;

    async _handle(payload: Payload) {
        return await this.core.apis.PacketApi.pkt.operation.GetStrangerStatus(payload.user_id);
    }
}
