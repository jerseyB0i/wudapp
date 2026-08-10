/**
 * StorageService — filesystem abstraction.
 * Swap internals here to use S3/R2 without touching any other module.
 */
import fs from 'fs/promises';
import path from 'path';
import { config } from './config.js';

export class StorageService {
	private base = config.UPLOADS_DIR;

	buildPath(type: 'images' | 'videos' | 'voice', filename: string): string {
		const now = new Date();
		const yyyy = now.getFullYear();
		const mm = String(now.getMonth() + 1).padStart(2, '0');
		const dd = String(now.getDate()).padStart(2, '0');
		return path.join(this.base, type, String(yyyy), mm, dd, filename);
	}

	async ensureDir(filePath: string): Promise<void> {
		await fs.mkdir(path.dirname(filePath), { recursive: true });
	}

	async move(src: string, dest: string): Promise<void> {
		await this.ensureDir(dest);
		await fs.rename(src, dest);
	}

	async delete(filePath: string): Promise<void> {
		await fs.unlink(filePath).catch(() => {});
	}

	toPublicUrl(filePath: string): string {
		// Strips the uploads dir prefix so the path is web-relative
		return '/' + path.relative(this.base, filePath).replace(/\\/g, '/');
	}
}

export const storageService = new StorageService();
