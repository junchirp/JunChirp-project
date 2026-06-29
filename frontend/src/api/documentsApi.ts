import mainApi from './mainApi';
import { DocumentInterface } from '@/shared/interfaces/ducument.interface';
import { CreateDocumentInterface } from '@/shared/interfaces/create-ducument.interface';

export const documentsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<DocumentInterface[], string>({
      query: (id) => ({
        url: `projects/${id}/documents`,
      }),
      providesTags: (_result, _error, id) => [{ type: 'docs', id }],
    }),
    createDocument: builder.mutation<
      DocumentInterface,
      CreateDocumentInterface
    >({
      query: (data) => ({
        url: 'documents',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, data) => [
        { type: 'docs', id: data.projectId },
      ],
    }),
    updateDocument: builder.mutation<
      DocumentInterface,
      { id: string; data: CreateDocumentInterface }
    >({
      query: ({ id, data }) => ({
        url: `documents/${id}`,
        method: 'PUT',
        body: { documentName: data.documentName, projectId: data.projectId },
      }),
      invalidatesTags: (_result, _error, { data }) => [
        { type: 'docs', id: data.projectId },
      ],
    }),
    deleteDocument: builder.mutation<void, { id: string; projectId: string }>({
      query: ({ id }) => ({
        url: `documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'docs', id: projectId },
      ],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
} = documentsApi;
