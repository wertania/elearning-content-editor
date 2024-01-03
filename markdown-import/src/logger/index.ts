import fs from "fs";
import path from "path";

const LOG_FOLDER = "logs";

const DOCUMENT_LOG = "_created_nodes_<timestamp>.log";
const IMPORT_LOG = "_import_log_<timestamp>.log";

function getLogPath(folder: string, logFile: string) {
  return path.join(
    folder,
    logFile.replace("<timestamp>", new Date().toISOString()),
  );
}

class Logger {
  private documentLogPath: string = getLogPath(LOG_FOLDER, DOCUMENT_LOG);
  private importLogPath: string = getLogPath(LOG_FOLDER, IMPORT_LOG);

  constructor() {
    if (!fs.existsSync(LOG_FOLDER)) {
      fs.mkdirSync(LOG_FOLDER);
    }
  }

  public logDocumentCreation(id: string, name: string): void {
    this.log(this.documentLogPath, "NEW DOCUMENT", `${id} ${name}`);
  }

  public info(...message: any[]): void {
    this.log(this.importLogPath, "INFO", message.join(" "));
  }

  public error(...message: any[]): void {
    this.log(this.importLogPath, "ERROR", message.join(" "));
  }

  public warn(...message: any[]): void {
    this.log(this.importLogPath, "WARN", message.join(" "));
  }

  private log(filePath: string, type: string, message: string): void {
    const prefix = `[${type}] ${new Date().toISOString()}:`;
    const formattedMessage = `${prefix} ${message}\n`;

    if (process.env.DEBUG) {
      console.log(prefix, message);
    }

    fs.appendFileSync(filePath, formattedMessage);
  }
}

export default new Logger();
