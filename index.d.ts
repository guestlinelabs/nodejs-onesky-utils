interface OneSkyOptions {
  /**
   * OneSky project ID
   */
  projectId: number;
  /**
   * OneSky private key
   */
  secret: string;
  /**
   * OneSky public key
   */
  apiKey: string;
}

interface OneSkyFileOptions extends OneSkyOptions {
  /**
   * Language to download
   */
  language: string;
}

export function getFile(
  opts: OneSkyFileOptions & {
    fileName: string;
  }
): Promise<string>;

export function getMultilingualFile(
  opts: OneSkyFileOptions & {
    fileName: string;
    format: string;
  }
): Promise<string>;

export function getFiles(opts: OneSkyOptions): Promise<string>;

export function getLanguages(opts: OneSkyOptions): Promise<string>;

type Format =
  | "IOS_STRINGS"
  | "IOS_STRINGSDICT_XML"
  | "GNU_PO"
  | "ANDROID_XML"
  | "ANDROID_JSON"
  | "JAVA_PROPERTIES"
  | "RUBY_YML"
  | "RUBY_YAML"
  | "FLASH_XML"
  | "GNU_POT"
  | "RRC"
  | "RESX"
  | "HIERARCHICAL_JSON"
  | "PHP"
  | "PHP_SHORT_ARRAY"
  | "PHP_VARIABLES"
  | "HTML"
  | "RESW"
  | "YML"
  | "YAML"
  | "ADEMPIERE_XML"
  | "IDEMPIERE_XML"
  | "QT_TS_XML"
  | "XLIFF"
  | "RESJSON"
  | "TMX"
  | "L10N"
  | "INI"
  | "REQUIREJS";

export function postFile(
  opts: OneSkyFileOptions & {
    format: Format;
    content: string;
    /**
     * For strings that cannot be found in newly uploaded file with same file name, keep those strings unchange if set to true.
     * Deprecate those strings if set to false. Notice that different files will not interfere each other in the same project.
     * For example, with setting is_keeping_all_strings to false, uploading en2.po will not deprecate strings of previously uploaded file, en.po.
     */
    keepStrings: boolean;
    fileName: string;
  }
): Promise<void>;

export function postScreenshot(
  opts: OneSkyOptions & {
    name: string;
    image: string;
    tags: {
      key: string;
      x: number;
      y: number;
      width: number;
      height: number;
      file: string;
    }[];
  }
): Promise<void>;
