/**
 * 프로젝트 프로파일 도구
 * 프로젝트별 설정 관리
 * v2.7: Project Profile
 */
import { ProjectProfile, StoredProfile, PublishingConfig, CodeAnalysisConfig, DocumentationConfig } from '../core/profileStorage.js';
export type ProfileAction = 'create' | 'get' | 'update' | 'delete' | 'list' | 'setActive' | 'getActive' | 'clone';
export interface ProjectProfileInput {
    action: ProfileAction;
    name?: string;
    description?: string;
    projectPath?: string;
    repository?: string;
    version?: string;
    publishing?: PublishingConfig;
    codeAnalysis?: CodeAnalysisConfig;
    documentation?: DocumentationConfig;
    defaultTags?: string[];
    tagCategories?: {
        name: string;
        tags: string[];
    }[];
    team?: {
        name: string;
        members?: {
            name: string;
            role?: string;
            email?: string;
        }[];
    };
    metadata?: Record<string, unknown>;
    profileId?: string;
    newName?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'createdAt' | 'updatedAt' | 'name';
    sortOrder?: 'asc' | 'desc';
}
export interface ProjectProfileOutput {
    success: boolean;
    action: ProfileAction;
    profile?: ProjectProfile;
    profiles?: StoredProfile[];
    total?: number;
    message?: string;
    error?: string;
}
export declare function projectProfileTool(input: ProjectProfileInput): Promise<ProjectProfileOutput>;
export declare const projectProfileSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            action: {
                type: string;
                enum: string[];
                description: string;
            };
            profileId: {
                type: string;
                description: string;
            };
            name: {
                type: string;
                description: string;
            };
            newName: {
                type: string;
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
            projectPath: {
                type: string;
                description: string;
            };
            repository: {
                type: string;
                description: string;
            };
            version: {
                type: string;
                description: string;
            };
            publishing: {
                type: string;
                description: string;
                properties: {
                    defaultPlatform: {
                        type: string;
                        enum: string[];
                    };
                    platformSettings: {
                        type: string;
                    };
                    autoPublish: {
                        type: string;
                    };
                };
            };
            codeAnalysis: {
                type: string;
                description: string;
                properties: {
                    defaultLanguage: {
                        type: string;
                        enum: string[];
                    };
                    defaultDiagramTypes: {
                        type: string;
                        items: {
                            type: string;
                            enum: string[];
                        };
                    };
                    excludePatterns: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    useAI: {
                        type: string;
                    };
                };
            };
            documentation: {
                type: string;
                description: string;
                properties: {
                    defaultDocType: {
                        type: string;
                        enum: string[];
                    };
                    language: {
                        type: string;
                        enum: string[];
                    };
                    author: {
                        type: string;
                    };
                    license: {
                        type: string;
                    };
                    includeTableOfContents: {
                        type: string;
                    };
                };
            };
            defaultTags: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            tagCategories: {
                type: string;
                description: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        tags: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                    };
                };
            };
            team: {
                type: string;
                description: string;
                properties: {
                    name: {
                        type: string;
                    };
                    members: {
                        type: string;
                        items: {
                            type: string;
                            properties: {
                                name: {
                                    type: string;
                                };
                                role: {
                                    type: string;
                                };
                                email: {
                                    type: string;
                                };
                            };
                        };
                    };
                };
            };
            metadata: {
                type: string;
                description: string;
            };
            limit: {
                type: string;
                description: string;
            };
            offset: {
                type: string;
                description: string;
            };
            sortBy: {
                type: string;
                enum: string[];
                description: string;
            };
            sortOrder: {
                type: string;
                enum: string[];
                description: string;
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=projectProfile.d.ts.map