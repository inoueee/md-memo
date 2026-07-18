/**
 * config_sample.js
 *
 * このファイルを config.js にコピーしてお使いください。
 * config.js は .gitignore に含まれており、git管理対象外です。
 */
window.APP_CONFIG = {
  ads: {
    /** 広告を表示するかどうか */
    enabled: true,

    /** Google AdSense パブリッシャーID（ca-pub-XXXXXXXXXXXXXXXX の数値部分） */
    publisherId: '0000000000000000',

    /** ヘッダー下の広告 */
    header: {
      /** Google AdSense スロットID */
      slot: '0000000000',
      /** 広告フォーマット（例: auto, horizontal, vertical, rectangle） */
      format: 'auto',
      /** レスポンシブにするか */
      responsive: true,
    },

    /** サイドバー内の広告 */
    sidebar: {
      /** Google AdSense スロットID */
      slot: '0000000000',
      /** 広告フォーマット */
      format: 'auto',
      /** レスポンシブにするか */
      responsive: true,
    },
  },

  analytics: {
    /** Google Analytics を有効にするかどうか */
    enabled: true,
    /** Google Analytics 測定ID（G-XXXXXXXXXX） */
    measurementId: 'G-XXXXXXXXXX',
  },
};
