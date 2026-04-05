export type FileSystemNodeType = 'file' | 'directory';

export interface FileSystemNode {
  name: string;
  type: FileSystemNodeType;
  content?: string;
  children?: FileSystemNode[];
  parent?: FileSystemNode;
  permissions?: string;
  size?: number;
  modified?: string;
}
