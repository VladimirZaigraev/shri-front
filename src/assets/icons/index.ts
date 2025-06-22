// Импорт всех SVG иконок как React компонентов
import { ReactComponent as MageUpload } from "./mage_upload.svg";
import { ReactComponent as MetricJob } from "./metric-job.svg";
import { ReactComponent as ProiconsCancel } from "./proicons_cancel.svg";
import { ReactComponent as SolarHistory } from "./solar_history-linear.svg";
import { ReactComponent as Loader } from "./mingcute_loading-3-line.svg";
// Мап всех доступных иконок
export const icons = {
  "mage-upload": MageUpload,
  "metric-job": MetricJob,
  "proicons-cancel": ProiconsCancel,
  "solar-history": SolarHistory,
  loader: Loader,
} as const;

// Тип для названий иконок
export type IconName = keyof typeof icons;

// Экспорт отдельных иконок для прямого использования
export { MageUpload, MetricJob, ProiconsCancel, SolarHistory, Loader };
