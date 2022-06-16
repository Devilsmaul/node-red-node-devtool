import { copyFileSync, cpSync, existsSync, lstatSync, mkdirSync, readdirSync } from "fs";
import path from "path";

export class BuildPreparation {
  prepare() {
    const srcFolder = "src";
    const destFolder = "dist";
    const files: string[] = this.grabFiles(
      srcFolder,
      (f) => f.toLowerCase().endsWith(".html") || f.toLowerCase().endsWith(".json") || f.toLowerCase().endsWith(".png") || f.toLowerCase().endsWith(".svg")
    );
    for (const f of files) {
      const destinationDirectory = path.resolve(path.join(destFolder, path.dirname(f)));

      if (!existsSync(destinationDirectory)) {
        mkdirSync(destinationDirectory, { recursive: true });
      }
      copyFileSync(path.resolve(path.join(srcFolder, f)), path.join(destinationDirectory, path.basename(f)));
    }
  }

  /**
   * searches the directory recursively and report all files back with path.
   * @param directory the start directory to crawl
   * @param filter filter which is used on each file to filter the grabbed files
   * @returns an array of file pathes.
   */
  grabFiles(directory: string, filter?: (file: string) => boolean) {
    const files2Copy: string[] = [];
    this.grabFilesRecursive(directory, files2Copy, filter);

    files2Copy.forEach((value: string, index: number, array: string[]) => {
      array[index] = value.substring(directory.length);
    });
    return files2Copy;
  }

  private grabFilesRecursive(directory, files2Copy: string[], filter?: (file: string) => boolean) {
    readdirSync(directory).forEach((File) => {
      const Absolute: string = path.join(directory, File);
      if (lstatSync(Absolute).isDirectory()) {
        return this.grabFilesRecursive(Absolute, files2Copy, filter);
      } else {
        if (!filter) {
          return files2Copy.push(Absolute);
        }
        if (filter(Absolute)) {
          return files2Copy.push(Absolute);
        }
      }
    });
  }
}

const bp = new BuildPreparation();
bp.prepare();
