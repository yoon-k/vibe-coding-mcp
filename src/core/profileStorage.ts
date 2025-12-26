/**
 * 프로젝트 프로파일 스토리지 모듈
 * 프로젝트별 설정을 저장하고 관리
 * v2.7: Project Profile
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import { logger } from './logger.js';

const profileLogger = logger.child({ module: 'profileStorage' });

export interface PublishingConfig {
  defaultPlatform?: 'notion' | 'github-wiki' | 'obsidian' | 'confluence' | 'slack' | 'discord';
  platformSettings?: {
    notion?: { databaseId?: string };
    obsidian?: { vaultPath?: string };
    confluence?: { spaceKey?: string };
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

  // 프로젝트 메타데이터
  projectPath?: string;
  repository?: string;
  version?: string;

  // 설정
  publishing?: PublishingConfig;
  codeAnalysis?: CodeAnalysisConfig;
  documentation?: DocumentationConfig;

  // 태그 관리
  defaultTags?: string[];
  tagCategories?: { name: string; tags: string[] }[];

  // 팀 정보
  team?: {
    name: string;
    members?: { name: string; role?: string; email?: string }[];
  };

  // 커스텀 메타데이터
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

// 기본 저장 경로
const DEFAULT_STORAGE_DIR = process.env.VIBE_CODING_STORAGE_DIR ||
  path.join(process.env.HOME || process.env.USERPROFILE || '.', '.vibe-coding-mcp', 'profiles');

let storageDir = DEFAULT_STORAGE_DIR;
let activeProfileId: string | null = null;

/**
 * 스토리지 초기화
 */
export async function initializeProfileStorage(customDir?: string): Promise<void> {
  if (customDir) {
    storageDir = customDir;
  }

  try {
    await fs.mkdir(storageDir, { recursive: true });

    // 활성 프로파일 ID 로드
    const activeFile = path.join(storageDir, '.active');
    try {
      activeProfileId = (await fs.readFile(activeFile, 'utf-8')).trim();
    } catch {
      activeProfileId = null;
    }

    profileLogger.info('Profile storage initialized', { path: storageDir });
  } catch (error) {
    profileLogger.error('Failed to initialize profile storage', error as Error);
    throw error;
  }
}

/**
 * 프로파일 ID 생성
 */
function generateProfileId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `profile_${timestamp}_${random}`;
}

/**
 * 프로파일 파일 경로
 */
function getProfilePath(profileId: string): string {
  return path.join(storageDir, `${profileId}.json`);
}

/**
 * 프로파일 생성
 */
export async function createProfile(data: Omit<ProjectProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectProfile> {
  await initializeProfileStorage();

  const profileId = generateProfileId();
  const now = new Date().toISOString();

  const profile: ProjectProfile = {
    id: profileId,
    createdAt: now,
    updatedAt: now,
    ...data
  };

  const filePath = getProfilePath(profileId);

  try {
    await fs.writeFile(filePath, JSON.stringify(profile, null, 2), 'utf-8');
    profileLogger.info('Profile created', { profileId, name: profile.name });
    return profile;
  } catch (error) {
    profileLogger.error('Failed to create profile', error as Error);
    throw error;
  }
}

/**
 * 프로파일 조회
 */
export async function getProfile(profileId: string): Promise<ProjectProfile | null> {
  const filePath = getProfilePath(profileId);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as ProjectProfile;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    profileLogger.error('Failed to read profile', error as Error);
    throw error;
  }
}

/**
 * 프로파일 업데이트
 */
export async function updateProfile(profileId: string, updates: Partial<Omit<ProjectProfile, 'id' | 'createdAt'>>): Promise<ProjectProfile> {
  const existing = await getProfile(profileId);
  if (!existing) {
    throw new Error(`Profile not found: ${profileId}`);
  }

  const updated: ProjectProfile = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  const filePath = getProfilePath(profileId);

  try {
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2), 'utf-8');
    profileLogger.info('Profile updated', { profileId });
    return updated;
  } catch (error) {
    profileLogger.error('Failed to update profile', error as Error);
    throw error;
  }
}

/**
 * 프로파일 삭제
 */
export async function deleteProfile(profileId: string): Promise<boolean> {
  const filePath = getProfilePath(profileId);

  try {
    await fs.unlink(filePath);

    // 활성 프로파일이면 해제
    if (activeProfileId === profileId) {
      await setActiveProfile(null);
    }

    profileLogger.info('Profile deleted', { profileId });
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false;
    }
    profileLogger.error('Failed to delete profile', error as Error);
    throw error;
  }
}

/**
 * 모든 프로파일 목록
 */
export async function listProfiles(options?: {
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}): Promise<{ profiles: StoredProfile[]; total: number }> {
  await initializeProfileStorage();

  const { limit = 50, offset = 0, sortBy = 'updatedAt', sortOrder = 'desc' } = options || {};

  try {
    const files = await fs.readdir(storageDir);
    const profileFiles = files.filter(f => f.endsWith('.json') && !f.startsWith('.'));

    const profiles: StoredProfile[] = [];

    for (const file of profileFiles) {
      try {
        const content = await fs.readFile(path.join(storageDir, file), 'utf-8');
        const data = JSON.parse(content) as ProjectProfile;

        profiles.push({
          id: data.id,
          name: data.name,
          description: data.description,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          isActive: data.id === activeProfileId
        });
      } catch {
        continue;
      }
    }

    // 정렬
    profiles.sort((a, b) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'desc' ? -cmp : cmp;
    });

    // 페이지네이션
    const total = profiles.length;
    const paginated = profiles.slice(offset, offset + limit);

    return { profiles: paginated, total };
  } catch (error) {
    profileLogger.error('Failed to list profiles', error as Error);
    throw error;
  }
}

/**
 * 활성 프로파일 설정
 */
export async function setActiveProfile(profileId: string | null): Promise<void> {
  await initializeProfileStorage();

  const activeFile = path.join(storageDir, '.active');

  try {
    if (profileId) {
      // 프로파일 존재 확인
      const profile = await getProfile(profileId);
      if (!profile) {
        throw new Error(`Profile not found: ${profileId}`);
      }

      await fs.writeFile(activeFile, profileId, 'utf-8');
      activeProfileId = profileId;
      profileLogger.info('Active profile set', { profileId });
    } else {
      try {
        await fs.unlink(activeFile);
      } catch { /* ignore */ }
      activeProfileId = null;
      profileLogger.info('Active profile cleared');
    }
  } catch (error) {
    profileLogger.error('Failed to set active profile', error as Error);
    throw error;
  }
}

/**
 * 활성 프로파일 조회
 */
export async function getActiveProfile(): Promise<ProjectProfile | null> {
  await initializeProfileStorage();

  if (!activeProfileId) {
    return null;
  }

  return getProfile(activeProfileId);
}

/**
 * 이름으로 프로파일 검색
 */
export async function findProfileByName(name: string): Promise<ProjectProfile | null> {
  const { profiles } = await listProfiles({ limit: 1000 });

  const found = profiles.find(p =>
    p.name.toLowerCase() === name.toLowerCase()
  );

  if (found) {
    return getProfile(found.id);
  }

  return null;
}

/**
 * 프로파일 복제
 */
export async function cloneProfile(profileId: string, newName: string): Promise<ProjectProfile> {
  const source = await getProfile(profileId);
  if (!source) {
    throw new Error(`Profile not found: ${profileId}`);
  }

  const { id, createdAt, updatedAt, ...profileData } = source;

  return createProfile({
    ...profileData,
    name: newName,
    description: `Cloned from ${source.name}`
  });
}
