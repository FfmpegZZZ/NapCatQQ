import { NapCatCore } from '@/core';
import { SelfInfo } from '@/core/types';
import { LogWrapper } from '@/common/log';

/**
 * A basic handler for Model Context Protocol (MCP) requests within NapCatQQ.
 * This initial version focuses on handling resource requests.
 */
export class NapCatMCP {
    private core: NapCatCore;
    private logger: LogWrapper;

    constructor(core: NapCatCore) {
        this.core = core;
        this.logger = core.context.logger;
        this.logger.log('[MCP] NapCatMCP Initialized.');
    }

    /**
     * Handles an MCP resource request URI.
     *
     * @param uri The resource URI (e.g., "napcat://self_info")
     * @returns The requested resource data or null if the URI is not supported.
     */
    public handleResourceRequest(uri: string): SelfInfo | null {
        this.logger.logDebug(`[MCP] Handling resource request: ${uri}`);

        if (uri === 'napcat://self_info') {
            return this.getSelfInfo();
        }

        this.logger.logWarn(`[MCP] Unsupported resource URI: ${uri}`);
        return null;
    }

    private getSelfInfo(): SelfInfo {
        // Access selfInfo directly from the core instance
        return this.core.selfInfo;
    }

    // Placeholder for future tool handling
    // public handleToolRequest(toolName: string, args: any): any {
    //     this.logger.logDebug(`[MCP] Handling tool request: ${toolName}`);
    //     // TODO: Implement tool handling logic
    //     return { error: 'Tool not implemented' };
    // }
}
