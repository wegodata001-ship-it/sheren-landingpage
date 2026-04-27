import type { SupportedLanguage } from "./localized-content";

type TranslateTextInput = {
  text: string;
  fromLang: SupportedLanguage;
  toLang: SupportedLanguage;
};

type TranslateContentObjectInput<T> = {
  content: T;
  fromLang: SupportedLanguage;
  toLang: SupportedLanguage;
};

// TODO: connect a real provider such as OpenAI, Google Translate, or DeepL.
// For now this placeholder copies the source text so admins can review manually.
export async function translateText({ text }: TranslateTextInput) {
  return text;
}

export async function translateContentObject<T>({ content }: TranslateContentObjectInput<T>): Promise<T> {
  return content;
}
