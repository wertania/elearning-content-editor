import { Medium, MediumType } from './types';
import { useDocumentStore } from '../../stores/documents';

function getFileType(file: File): MediumType {
  return file.type.split('/')[0] as MediumType;
}

function getFileName(file: File): string {
  return file.name.split('.')[0];
}

async function createHash(file: File): Promise<string> {
  // return random string for now
  // TODO: implement hashing
  return Math.random().toString(36).substring(7);
}

async function uploadToBlob(file: File): Promise<{ id: string; url: string }> {
  return { id: '123', url: 'https://picsum.photos/512/512' };
}

const documentStore = useDocumentStore();

export default {
  async uploadMedium(file: File): Promise<string> {
    const res = await uploadToBlob(file);
    const type = getFileType(file);
    const name = getFileName(file);
    const hash = await createHash(file);

    const media: Medium = {
      id: res.id,
      url: res.url,
      type: type,
      name: name,
      hash: hash,
    };

    documentStore.addMedium(media);

    return media.id;
  },
};
