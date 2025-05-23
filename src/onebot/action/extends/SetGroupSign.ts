import { GetPacketStatusDepends } from '@/onebot/action/packet/GetPacketStatus';
import { ActionName } from '@/onebot/action/router';
import { z } from 'zod';

const SchemaData = z.object({
    group_id: z.coerce.string(),
});

type Payload = z.infer<typeof SchemaData>;

class SetGroupSignBase extends GetPacketStatusDepends<Payload, void> {
    override payloadSchema = SchemaData;

    async _handle(payload: Payload) {
        return await this.core.apis.PacketApi.pkt.operation.GroupSign(+payload.group_id);
    }
}

export class SetGroupSign extends SetGroupSignBase {
    override actionName = ActionName.SetGroupSign;
}

export class SendGroupSign extends SetGroupSignBase {
    override actionName = ActionName.SendGroupSign;
}
