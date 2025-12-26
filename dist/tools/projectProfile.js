/**
 * 프로젝트 프로파일 도구
 * 프로젝트별 설정 관리
 * v2.7: Project Profile
 */
import { createProfile, getProfile, updateProfile, deleteProfile, listProfiles, setActiveProfile, getActiveProfile, findProfileByName, cloneProfile } from '../core/profileStorage.js';
export async function projectProfileTool(input) {
    const { action } = input;
    try {
        switch (action) {
            case 'create': {
                if (!input.name) {
                    return {
                        success: false,
                        action,
                        error: 'name is required for create action'
                    };
                }
                const profile = await createProfile({
                    name: input.name,
                    description: input.description,
                    projectPath: input.projectPath,
                    repository: input.repository,
                    version: input.version,
                    publishing: input.publishing,
                    codeAnalysis: input.codeAnalysis,
                    documentation: input.documentation,
                    defaultTags: input.defaultTags,
                    tagCategories: input.tagCategories,
                    team: input.team,
                    metadata: input.metadata
                });
                return {
                    success: true,
                    action,
                    profile,
                    message: `Profile created: ${profile.name} (${profile.id})`
                };
            }
            case 'get': {
                if (!input.profileId) {
                    // 이름으로 찾기 시도
                    if (input.name) {
                        const profile = await findProfileByName(input.name);
                        if (!profile) {
                            return {
                                success: false,
                                action,
                                error: `Profile not found: ${input.name}`
                            };
                        }
                        return {
                            success: true,
                            action,
                            profile,
                            message: `Profile retrieved: ${profile.name}`
                        };
                    }
                    return {
                        success: false,
                        action,
                        error: 'profileId or name is required for get action'
                    };
                }
                const profile = await getProfile(input.profileId);
                if (!profile) {
                    return {
                        success: false,
                        action,
                        error: `Profile not found: ${input.profileId}`
                    };
                }
                return {
                    success: true,
                    action,
                    profile,
                    message: `Profile retrieved: ${profile.name}`
                };
            }
            case 'update': {
                if (!input.profileId) {
                    return {
                        success: false,
                        action,
                        error: 'profileId is required for update action'
                    };
                }
                const updates = {};
                if (input.name !== undefined)
                    updates.name = input.name;
                if (input.description !== undefined)
                    updates.description = input.description;
                if (input.projectPath !== undefined)
                    updates.projectPath = input.projectPath;
                if (input.repository !== undefined)
                    updates.repository = input.repository;
                if (input.version !== undefined)
                    updates.version = input.version;
                if (input.publishing !== undefined)
                    updates.publishing = input.publishing;
                if (input.codeAnalysis !== undefined)
                    updates.codeAnalysis = input.codeAnalysis;
                if (input.documentation !== undefined)
                    updates.documentation = input.documentation;
                if (input.defaultTags !== undefined)
                    updates.defaultTags = input.defaultTags;
                if (input.tagCategories !== undefined)
                    updates.tagCategories = input.tagCategories;
                if (input.team !== undefined)
                    updates.team = input.team;
                if (input.metadata !== undefined)
                    updates.metadata = input.metadata;
                const profile = await updateProfile(input.profileId, updates);
                return {
                    success: true,
                    action,
                    profile,
                    message: `Profile updated: ${profile.name}`
                };
            }
            case 'delete': {
                if (!input.profileId) {
                    return {
                        success: false,
                        action,
                        error: 'profileId is required for delete action'
                    };
                }
                const deleted = await deleteProfile(input.profileId);
                if (!deleted) {
                    return {
                        success: false,
                        action,
                        error: `Profile not found: ${input.profileId}`
                    };
                }
                return {
                    success: true,
                    action,
                    message: `Profile deleted: ${input.profileId}`
                };
            }
            case 'list': {
                const { profiles, total } = await listProfiles({
                    limit: input.limit,
                    offset: input.offset,
                    sortBy: input.sortBy,
                    sortOrder: input.sortOrder
                });
                return {
                    success: true,
                    action,
                    profiles,
                    total,
                    message: `Found ${total} profile(s)`
                };
            }
            case 'setActive': {
                await setActiveProfile(input.profileId || null);
                return {
                    success: true,
                    action,
                    message: input.profileId
                        ? `Active profile set: ${input.profileId}`
                        : 'Active profile cleared'
                };
            }
            case 'getActive': {
                const profile = await getActiveProfile();
                if (!profile) {
                    return {
                        success: true,
                        action,
                        message: 'No active profile set'
                    };
                }
                return {
                    success: true,
                    action,
                    profile,
                    message: `Active profile: ${profile.name}`
                };
            }
            case 'clone': {
                if (!input.profileId) {
                    return {
                        success: false,
                        action,
                        error: 'profileId is required for clone action'
                    };
                }
                if (!input.newName) {
                    return {
                        success: false,
                        action,
                        error: 'newName is required for clone action'
                    };
                }
                const profile = await cloneProfile(input.profileId, input.newName);
                return {
                    success: true,
                    action,
                    profile,
                    message: `Profile cloned: ${profile.name} (${profile.id})`
                };
            }
            default:
                return {
                    success: false,
                    action,
                    error: `Unknown action: ${action}`
                };
        }
    }
    catch (error) {
        return {
            success: false,
            action,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}
export const projectProfileSchema = {
    name: 'muse_project_profile',
    description: 'Manages project profiles for vibe coding sessions. Save project-specific settings for documentation, code analysis, and publishing.',
    inputSchema: {
        type: 'object',
        properties: {
            action: {
                type: 'string',
                enum: ['create', 'get', 'update', 'delete', 'list', 'setActive', 'getActive', 'clone'],
                description: 'Action: create, get, update, delete, list, setActive, getActive, clone'
            },
            profileId: {
                type: 'string',
                description: 'Profile ID (for get, update, delete, setActive, clone)'
            },
            name: {
                type: 'string',
                description: 'Profile name (required for create, optional for get by name)'
            },
            newName: {
                type: 'string',
                description: 'New name for cloned profile (required for clone)'
            },
            description: {
                type: 'string',
                description: 'Profile description'
            },
            projectPath: {
                type: 'string',
                description: 'Path to the project directory'
            },
            repository: {
                type: 'string',
                description: 'Git repository URL'
            },
            version: {
                type: 'string',
                description: 'Project version'
            },
            publishing: {
                type: 'object',
                description: 'Publishing settings (defaultPlatform, platformSettings, autoPublish)',
                properties: {
                    defaultPlatform: {
                        type: 'string',
                        enum: ['notion', 'github-wiki', 'obsidian', 'confluence', 'slack', 'discord']
                    },
                    platformSettings: { type: 'object' },
                    autoPublish: { type: 'boolean' }
                }
            },
            codeAnalysis: {
                type: 'object',
                description: 'Code analysis settings (defaultLanguage, defaultDiagramTypes, excludePatterns, useAI)',
                properties: {
                    defaultLanguage: {
                        type: 'string',
                        enum: ['typescript', 'javascript', 'python', 'go']
                    },
                    defaultDiagramTypes: {
                        type: 'array',
                        items: { type: 'string', enum: ['class', 'flowchart', 'dependency', 'all'] }
                    },
                    excludePatterns: {
                        type: 'array',
                        items: { type: 'string' }
                    },
                    useAI: { type: 'boolean' }
                }
            },
            documentation: {
                type: 'object',
                description: 'Documentation settings (defaultDocType, language, author, license, includeTableOfContents)',
                properties: {
                    defaultDocType: {
                        type: 'string',
                        enum: ['README', 'DESIGN', 'TUTORIAL', 'CHANGELOG', 'API', 'ARCHITECTURE']
                    },
                    language: { type: 'string', enum: ['en', 'ko'] },
                    author: { type: 'string' },
                    license: { type: 'string' },
                    includeTableOfContents: { type: 'boolean' }
                }
            },
            defaultTags: {
                type: 'array',
                items: { type: 'string' },
                description: 'Default tags applied to all sessions'
            },
            tagCategories: {
                type: 'array',
                description: 'Tag categories for organization',
                items: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        tags: { type: 'array', items: { type: 'string' } }
                    }
                }
            },
            team: {
                type: 'object',
                description: 'Team information',
                properties: {
                    name: { type: 'string' },
                    members: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                role: { type: 'string' },
                                email: { type: 'string' }
                            }
                        }
                    }
                }
            },
            metadata: {
                type: 'object',
                description: 'Custom metadata'
            },
            limit: {
                type: 'number',
                description: 'Max results for list (default: 50)'
            },
            offset: {
                type: 'number',
                description: 'Skip results for list (default: 0)'
            },
            sortBy: {
                type: 'string',
                enum: ['createdAt', 'updatedAt', 'name'],
                description: 'Sort field for list'
            },
            sortOrder: {
                type: 'string',
                enum: ['asc', 'desc'],
                description: 'Sort order for list'
            }
        },
        required: ['action']
    }
};
//# sourceMappingURL=projectProfile.js.map