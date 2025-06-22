import type { FC } from "react";
import { useRef, useState, useCallback } from "react";
import styles from "./FileUploader.module.css";
import { UploadButton } from "../../ui";
import { Type } from "../../ui/Button/UploadButton";
import { useApiStore } from "../../store/useApiStore";

interface FileUploaderProps {
  onFileUpload?: (file: File) => void;
  onFileRemove?: () => void;
  accept?: string;
  maxSizeInMB?: number;
  loading?: boolean;
  uploadedFile?: File | null;
}

export const FileUploader: FC<FileUploaderProps> = ({
  onFileUpload,
  onFileRemove,
  accept = ".csv",
  maxSizeInMB = 0,

  uploadedFile,
}) => {
  const { aggregateDataLoading, aggregate } = useApiStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<Type>(Type.active);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>("");

  const handleFileValidation = useCallback(
    (file: File): boolean => {
      // Проверяем размер файла
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        setError(`Размер файла превышает ${maxSizeInMB}MB`);
        setUploadState(Type.error);
        return false;
      }

      // Проверяем тип файла
      if (
        accept &&
        !accept.split(",").some((type) => {
          const cleanType = type.trim();
          if (cleanType.startsWith(".")) {
            return file.name.toLowerCase().endsWith(cleanType.toLowerCase());
          }
          return file.type.includes(cleanType);
        })
      ) {
        setError(`Неподдерживаемый тип файла. Ожидается: ${accept}`);
        setUploadState(Type.error);
        return false;
      }

      return true;
    },
    [accept, maxSizeInMB]
  );

  const processFile = useCallback(
    async (file: File) => {
      if (!handleFileValidation(file)) {
        return;
      }

      setError("");

      onFileUpload?.(file);
      setUploadState(Type.process);
    },
    [handleFileValidation, onFileUpload]
  );

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile]
  );

  const handleButtonClick = useCallback(() => {
    if (uploadState === Type.active) {
      fileInputRef.current?.click();
    }
  }, [uploadState]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(event.target.files);
      // Сбрасываем значение input, чтобы можно было загрузить тот же файл снова
      if (event.target) {
        event.target.value = "";
      }
    },
    [handleFileSelect]
  );

  // Drag & Drop обработчики
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (uploadState !== Type.active) {
        return;
      }

      const files = e.dataTransfer.files;
      handleFileSelect(files);
    },
    [uploadState, handleFileSelect]
  );

  const handleClose = useCallback(() => {
    setUploadState(Type.active);
    setError("");
    onFileRemove?.();
  }, [onFileRemove]);

  const getButtonProps = () => {
    const currentType = aggregateDataLoading ? Type.loading : uploadState;
    const hasSuccessfulData = !aggregateDataLoading && aggregate.data && !aggregate.error;
    const hasBackendError = !aggregateDataLoading && aggregate.error;
    const showClose =
      (uploadState === Type.error ||
        uploadState === Type.process ||
        uploadedFile ||
        hasSuccessfulData ||
        hasBackendError) &&
      !aggregateDataLoading;

    const baseProps = {
      type: currentType,
      onClick: handleButtonClick,
      onClose: showClose ? handleClose : undefined,
    };

    // Если идет загрузка данных (aggregateDataLoading), всегда показываем состояние loading
    if (aggregateDataLoading) {
      return {
        ...baseProps,
        type: Type.loading,
        disabled: true,
      };
    }

    // Если есть ошибка от бэкенда, показываем error
    if (uploadedFile && hasBackendError) {
      return {
        ...baseProps,
        title: uploadedFile.name,
        type: Type.error,
        subtitle: aggregate.error?.message || "Ошибка обработки файла",
        disabled: true,
      };
    }

    // Если файл загружен и данные успешно получены, показываем done
    if (uploadedFile && hasSuccessfulData) {
      return {
        ...baseProps,
        title: uploadedFile.name,
        type: Type.done,
      };
    }

    if (uploadState === Type.error && error) {
      return {
        ...baseProps,
        subtitle: error,
      };
    }

    if (uploadedFile) {
      return {
        ...baseProps,
        title: uploadedFile.name,
        type: Type.process,
      };
    }

    return {
      ...baseProps,
      disabled: uploadState !== Type.active,
    };
  };

  return (
    <div
      className={`${styles.fileUploader} ${isDragOver ? styles.fileUploader_dragOver : ""}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleInputChange} style={{ display: "none" }} />
      <UploadButton {...getButtonProps()} />
    </div>
  );
};
