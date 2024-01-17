import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_KEY;

/**
 * AI service for text translations
 * getTranslation(text, sourceLanguage, targetLanguage)
 */
export default {
  _openai: OPENAI_API_KEY
    ? new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true })
    : null,
  aiServicesAvailable: OPENAI_API_KEY ? true : false,

  async getTranslation(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
  ): Promise<string> {
    if (!this._openai) {
      throw new Error('AI services not available');
    }
    const response = await this._openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        {
          role: 'system',
          content: `You will be provided with a text ${
            sourceLanguage !== '' ? 'in ' + sourceLanguage : ''
          } and your task is to translate it into ${targetLanguage}. You only answer with the pure translation.`,
        },
        { role: 'user', content: text },
      ],
      temperature: 0,
      // max_tokens: 256,
    });
    console.log(response);
    if (!response.choices[0].message.content) {
      throw new Error('No valid response from Translator');
    }
    return response.choices[0].message.content;
  },
};
