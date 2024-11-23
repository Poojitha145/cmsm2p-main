import fs from 'fs';

export namespace FileUtil {

    export async function createDirectoryIfNotExists(directoryPath: string): Promise<string | undefined> {
        return await fs.promises.mkdir(directoryPath, { recursive: true });
    }
}