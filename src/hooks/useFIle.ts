import { useState } from "react";
import axios, { AxiosError } from "axios";

export const useFile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const saveMedia = async (
        file: File,
        userId: string,
        chatId: string
    ) => {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);
        formData.append('chatId', chatId);

        try {
            const response = await axios.put('/api/uploadMedia', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error?.response?.data?.message ?? 'Failed to upload file');
                throw new Error(error?.response?.data?.message ?? 'Failed to upload file');
            }
            setError('Failed to upload file');
            throw new Error('Failed to upload file');
        } finally {
            setLoading(false);
        }
    };


    const downloadMedia = (url: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const deleteMedia = () => {
        throw new Error('deleteMedia is not implemented.');
    };

    return {
        saveMedia,
        downloadMedia,
        deleteMedia,
        loading,
        error,
    };
};