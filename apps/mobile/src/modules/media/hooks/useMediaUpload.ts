import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../infrastructure/api.client';
import type { UploadMediaResponse, MediaUploadMeta } from '@wudapp/types';

export function useMediaUpload() {
  return useMutation({
    mutationFn: async ({
      file,
      meta,
    }: {
      file: File;
      meta: MediaUploadMeta;
    }) => {
      const form = new FormData();
      form.append('file', file);
      Object.entries(meta).forEach(([k, v]) => v !== undefined && form.append(k, String(v)));
      return apiClient
        .post<UploadMediaResponse>('/api/media/upload', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((r) => r.data);
    },
  });
}
