/**
 * 세션 Export 도구
 * 세션 데이터를 다양한 형식으로 내보내기
 * v2.7: Session Export
 */
export type ExportFormat = 'markdown' | 'json' | 'html';
export interface ExportSessionInput {
    sessionIds?: string[];
    format: ExportFormat;
    outputPath?: string;
    includeMetadata?: boolean;
    includeCodeBlocks?: boolean;
    includeDesignDecisions?: boolean;
    template?: 'default' | 'minimal' | 'detailed' | 'report';
    title?: string;
    bundleMultiple?: boolean;
}
export interface ExportSessionOutput {
    success: boolean;
    format: ExportFormat;
    content?: string;
    filePath?: string;
    sessionCount: number;
    message?: string;
    error?: string;
}
export declare function exportSessionTool(input: ExportSessionInput): Promise<ExportSessionOutput>;
export declare const exportSessionSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            sessionIds: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            format: {
                type: string;
                enum: string[];
                description: string;
            };
            outputPath: {
                type: string;
                description: string;
            };
            includeMetadata: {
                type: string;
                description: string;
            };
            includeCodeBlocks: {
                type: string;
                description: string;
            };
            includeDesignDecisions: {
                type: string;
                description: string;
            };
            template: {
                type: string;
                enum: string[];
                description: string;
            };
            title: {
                type: string;
                description: string;
            };
            bundleMultiple: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=exportSession.d.ts.map