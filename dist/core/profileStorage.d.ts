/**
 * 프로젝트 프로파일 스토리지 모듈
 * 프로젝트별 설정을 저장하고 관리
 * v2.7: Project Profile
 */
export interface PublishingConfig {
    defaultPlatform?: 'notion' | 'github-wiki' | 'obsidian' | 'confluence' | 'slack' | 'discord';
    platformSettings?: {
        notion?: {
            databaseId?: string;
        };
        obsidian?: {
            vaultPath?: string;
        };
        confluence?: {
            spaceKey?: string;
        };
    };
    autoPublish?: boolean;
}
export interface CodeAnalysisConfig {
    defaultLanguage?: 'typescript' | 'javascript' | 'python' | 'go';
    defaultDiagramTypes?: ('class' | 'flowchart' | 'dependency' | 'all')[];
    excludePatterns?: string[];
    useAI?: boolean;
}
export interface DocumentationConfig {
    defaultDocType?: 'README' | 'DESIGN' | 'TUTORIAL' | 'CHANGELOG' | 'API' | 'ARCHITECTURE';
    language?: 'en' | 'ko';
    author?: string;
    license?: string;
    includeTableOfContents?: boolean;
}
export interface ProjectProfile {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
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
}
export interface StoredProfile {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}
/**
 * 스토리지 초기화
 */
export declare function initializeProfileStorage(customDir?: string): Promise<void>;
/**
 * 프로파일 생성
 */
export declare function createProfile(data: Omit<ProjectProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectProfile>;
/**
 * 프로파일 조회
 */
export declare function getProfile(profileId: string): Promise<ProjectProfile | null>;
/**
 * 프로파일 업데이트
 */
export declare function updateProfile(profileId: string, updates: Partial<Omit<ProjectProfile, 'id' | 'createdAt'>>): Promise<ProjectProfile>;
/**
 * 프로파일 삭제
 */
export declare function deleteProfile(profileId: string): Promise<boolean>;
/**
 * 모든 프로파일 목록
 */
export declare function listProfiles(options?: {
    limit?: number;
    offset?: number;
    sortBy?: 'createdAt' | 'updatedAt' | 'name';
    sortOrder?: 'asc' | 'desc';
}): Promise<{
    profiles: StoredProfile[];
    total: number;
}>;
/**
 * 활성 프로파일 설정
 */
export declare function setActiveProfile(profileId: string | null): Promise<void>;
/**
 * 활성 프로파일 조회
 */
export declare function getActiveProfile(): Promise<ProjectProfile | null>;
/**
 * 이름으로 프로파일 검색
 */
export declare function findProfileByName(name: string): Promise<ProjectProfile | null>;
/**
 * 프로파일 복제
 */
export declare function cloneProfile(profileId: string, newName: string): Promise<ProjectProfile>;
//# sourceMappingURL=profileStorage.d.ts.map