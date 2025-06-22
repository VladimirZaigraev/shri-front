import React, { useState } from "react";
import styles from "./Analytics.module.css";
import { FileUploader } from "../../components";
import { BaseButton, PageWrapper, HighlightList } from "../../ui";
import { useApiStore } from "../../store/useApiStore";

export const Analytics = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { aggregateDataLoading, aggregate, aggregateDataStream, clearAggregateData } = useApiStore();

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const handleFileRemove = () => {
    setUploadedFile(null);
    clearAggregateData();
  };

  const handleSend = async () => {
    if (!uploadedFile) return;

    await aggregateDataStream(uploadedFile, 1000);
  };

  // Выводим объект ответа в консоль (если есть данные)
  if (aggregate.data) {
    console.log("Объект ответа:", aggregate.data);
  }
  console.log(aggregate.data);
  return (
    <PageWrapper>
      <div className={styles.analytics}>
        <h1 className={styles.title}>
          Загрузите <span className={styles.title_bold}>csv файл</span> и получите{" "}
          <span className={styles.title_bold}>полную информацию о нём</span> за сверхнизкое время
        </h1>
        <FileUploader
          onFileUpload={handleFileUpload}
          onFileRemove={handleFileRemove}
          accept=".csv"
          maxSizeInMB={50}
          loading={aggregateDataLoading}
          uploadedFile={uploadedFile}
        />

        <BaseButton disabled={!uploadedFile || aggregateDataLoading} onClick={handleSend}>
          Отправить
        </BaseButton>

        {aggregate.data && <HighlightList type="grid" info={aggregate.data} />}
        {!aggregate.data && <span className={styles.empty}>Здесь появятся хайлайты</span>}
      </div>
    </PageWrapper>
  );
};
