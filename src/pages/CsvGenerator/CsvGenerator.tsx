import { BaseButton, PageWrapper, UploadButton } from "../../ui";
import styles from "./CsvGenerator.module.css";
import { useApiStore } from "../../store/useApiStore";

export const CsvGenerator = () => {
  const { downloadReport, generateReport, generateReportLoading } = useApiStore();

  const handleGenerate = async () => {
    const res = await generateReport({ size: 0.01, withErrors: "off", maxSpend: 1000 });
    console.log(res);
    handleDownload();
  };

  const handleDownload = async () => {
    await downloadReport({ size: 0.01, withErrors: "off", maxSpend: 1000 }, "report.csv");
    console.log("done");
  };

  return (
    <PageWrapper>
      <div className={styles.csvGenerator}>
        <h1 className={styles.title}>Сгенерируйте готовый csv-файл нажатием одной кнопки</h1>
        <UploadButton type="active" />
        {generateReportLoading ? (
          <UploadButton type="loading" subtitle="идёт парсинг файла" />
        ) : (
          <BaseButton onClick={handleGenerate} disabled={generateReportLoading}>
            Начать генерацию
          </BaseButton>
        )}
      </div>
    </PageWrapper>
  );
};
