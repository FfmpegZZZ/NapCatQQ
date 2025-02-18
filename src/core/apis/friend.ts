import { FriendRequest, FriendV2 } from '@/core/types';
import { BuddyListReqType, InstanceContext, NapCatCore } from '@/core';
import { LimitedHashTable } from '@/common/message-unique';

export class NTQQFriendApi {
    context: InstanceContext;
    core: NapCatCore;

    constructor(context: InstanceContext, core: NapCatCore) {
        this.context = context;
        this.core = core;
    }
    async setBuddyRemark(uid: string, remark: string) {
        return this.context.session.getBuddyService().setBuddyRemark({ uid, remark });
    }
    async getBuddyV2SimpleInfoMap(refresh = false) {
        const buddyService = this.context.session.getBuddyService();
        const buddyListV2 = await buddyService.getBuddyListV2('0', BuddyListReqType.KNOMAL);
        const uids = buddyListV2.data.flatMap(item => item.buddyUids);
        return await this.core.eventWrapper.callNoListenerEvent(
            'NodeIKernelProfileService/getCoreAndBaseInfo',
            'nodeStore',
            uids,
        );
    }

    async getBuddy(refresh = false): Promise<FriendV2[]> {
        return Array.from((await this.getBuddyV2SimpleInfoMap(refresh)).values());
    }

    async getBuddyIdMap(refresh = false): Promise<LimitedHashTable<string, string>> {
        const retMap: LimitedHashTable<string, string> = new LimitedHashTable<string, string>(5000);
        const data = await this.getBuddyV2SimpleInfoMap(refresh);
        data.forEach((value) => retMap.set(value.uin!, value.uid!));
        return retMap;
    }
    async delBuudy(uid: string, tempBlock = false, tempBothDel = false) {
        return this.context.session.getBuddyService().delBuddy({
            friendUid: uid,
            tempBlock: tempBlock,
            tempBothDel: tempBothDel
        });
    }
    async getBuddyV2ExWithCate() {
        const buddyService = this.context.session.getBuddyService();
        const buddyListV2 = (await buddyService.getBuddyListV2('0', BuddyListReqType.KNOMAL)).data;
        const uids = buddyListV2.flatMap(item => {
            return item.buddyUids;
        });
        const data = await this.core.eventWrapper.callNoListenerEvent(
            'NodeIKernelProfileService/getCoreAndBaseInfo',
            'nodeStore',
            uids,
        );
        return buddyListV2.map(category => ({
            categoryId: category.categoryId,
            categorySortId: category.categorySortId,
            categoryName: category.categroyName,
            categoryMbCount: category.categroyMbCount,
            onlineCount: category.onlineCount,
            buddyList: category.buddyUids.map(uid => data.get(uid)).filter(value => !!value),
        }));
    }

    async isBuddy(uid: string) {
        return this.context.session.getBuddyService().isBuddy(uid);
    }

    async clearBuddyReqUnreadCnt() {
        return this.context.session.getBuddyService().clearBuddyReqUnreadCnt();
    }

    async getBuddyReq() {
        const [, ret] = await this.core.eventWrapper.callNormalEventV2(
            'NodeIKernelBuddyService/getBuddyReq',
            'NodeIKernelBuddyListener/onBuddyReqChange',
            [],
        );
        return ret;
    }

    async handleFriendRequest(notify: FriendRequest, accept: boolean) {
        this.context.session.getBuddyService()?.approvalFriendRequest({
            friendUid: notify.friendUid,
            reqTime: notify.reqTime,
            accept,
        });
    }
}
