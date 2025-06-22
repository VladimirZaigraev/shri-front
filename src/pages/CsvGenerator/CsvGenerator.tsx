import { BaseButton, PageWrapper, UploadButton } from "../../ui";
import styles from "./CsvGenerator.module.css";
import { useApiStore } from "../../store/useApiStore";

enum Type {
  error = "error",
  done = "done",
  loading = "loading",
}

export const CsvGenerator = () => {
  const { downloadReport, generateReport, generateReportLoading, reports, clearReportData } = useApiStore();

  const handleGenerate = async () => {
    const res = await generateReport({ size: 0.001, withErrors: "off", maxSpend: 1000 });
    console.log(res);
    if (res) {
      handleDownload();
    }
  };

  const handleDownload = async () => {
    await downloadReport({ size: 0.01, withErrors: "off", maxSpend: 1000 }, "file_uploaded.csv");
    console.log("done");
  };

  const handleClose = () => {
    clearReportData();
  };

  const renderButton = () => {
    if (generateReportLoading) {
      return <UploadButton type={Type.loading} subtitle="идёт генерация отчёта" />;
    }

    if (reports.error) {
      return <UploadButton type={Type.error} onClose={handleClose} />;
    }

    if (reports.data) {
      return (
        <UploadButton
          type={Type.done}
          onClick={handleDownload}
          onClose={handleClose}
          subtitle="файл сгенерирован!"
          disabled={false}
        />
      );
    }

    return (
      <BaseButton onClick={handleGenerate} disabled={generateReportLoading}>
        Начать генерацию
      </BaseButton>
    );
  };

  return (
    <PageWrapper>
      <div className={styles.csvGenerator}>
        <h1 className={styles.title}>Сгенерируйте готовый csv-файл нажатием одной кнопки</h1>
        {renderButton()}
      </div>
    </PageWrapper>
  );
};
