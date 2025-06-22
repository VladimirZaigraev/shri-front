// Импорт всех SVG иконок как React компонентов
import { ReactComponent as MageUpload } from "./mage_upload.svg";
import { ReactComponent as MetricJob } from "./metric-job.svg";
import { ReactComponent as ProiconsCancel } from "./proicons_cancel.svg";
import { ReactComponent as SolarHistory } from "./solar_history-linear.svg";
import { ReactComponent as Loader } from "./mingcute_loading-3-line.svg";
import { ReactComponent as File } from "./akar-icons_file.svg";
import { ReactComponent as Smile } from "./smaile.svg";
import { ReactComponent as SmileSad } from "./smiley-sad.svg";
import { ReactComponent as Trash } from "./trash.svg";

// Мап всех доступных иконок
export const icons = {
  "mage-upload": MageUpload,
  "metric-job": MetricJob,
  "proicons-cancel": ProiconsCancel,
  "solar-history": SolarHistory,
  loader: Loader,
  file: File,
  smile: Smile,
  smileSad: SmileSad,
  trash: Trash,
} as const;

// Тип для названий иконок
export type IconName = keyof typeof icons;

// Экспорт отдельных иконок для прямого использования
export { MageUpload, MetricJob, ProiconsCancel, SolarHistory, Loader, File, Smile, SmileSad, Trash };
