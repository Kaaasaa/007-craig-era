/**
 * 007 // CRAIG ERA (2006-2021)
 * Curated Digital Exhibition Data Layer
 *
 * Strict architectural isolation: Zero framework dependencies.
 * Full bilingual synchronization (zh / en).
 */

const SITE_DATA = {
  // ==========================================
  // CHINESE (SIMPLIFIED) // 中文策展文案
  // ==========================================
  zh: {
    meta: {
      title: "007 // 丹尼尔·克雷格时代影展 (2006–2021)",
      description: "致敬丹尼尔·克雷格版 007（2006–2021）的影院级互动视觉策展与解密档案。"
    },

    nav: {
      brandCode: "007 // CRAIG ERA",
      soundOff: "声效 关",
      soundOn: "声效 开",
      soundToggleAria: "切换滚动联动背景声效",
      langToggleZh: "中文",
      langToggleEn: "EN"
    },

    hero: {
      mainTitle: "DANIEL CRAIG",
      titleTranslation: "丹尼尔·克雷格",
      subtitle: "THE 007 ERA // 时代启示录",
      leadParagraph: "十五载风霜，五部史诗。褪去黄金时代的轻佻与浮华，一个带着血痕、肉身会碎裂的现代特工神话。",
      scrollPrompt: "SCROLL TO ENTER",
      scrollHint: "向下滑动以启幕"
    },

    stage: {
      dossierToggleAria: "展开或收起当前章节档案参数",
      dossierCloseAria: "关闭章节档案",
      dossierLabels: {
        director: "导演",
        location: "摄影与取景",
        gear: "标志器物"
      }
    },

    artifactsSection: {
      sectionIndex: "01",
      sectionCategory: "Q-BRANCH & BESPOKE TAILORING",
      title: "特工器物志",
      ui: {
        bezelPrefix: "BEZEL",
        bezelUnit: "MIN"
      }
    },

    mobileGate: {
      kicker: "DESIGNED FOR DESKTOP",
      message: "本作品为桌面端大屏视听献礼，建议在桌面浏览器开启完整体验",
      dismiss: "仍继续浏览"
    },

    curtainCall: {
      quote: "“We have all the time in the world.”",
      backToTopAria: "返回页面顶部",
      tributeMain: "他将不朽神话，塑为有血有肉的凡人。",
      tributeCredit: "致敬丹尼尔·克雷格 · 2006 — 2021",
      willReturn: "JAMES BOND WILL RETURN",
      hnStudioWordmark: "STUDIO",
      hnStudioSub: "DIGITAL ATELIER",
      hnReturnHint: "ESC / 点击空白处返回",
      hnCloseAria: "关闭 HN Studio 签名"
    },

    // ------------------------------------------
    // 五部曲完整元数据 (localBackdrop, audioSrc, 5%环境底光, L2/L3精简文案, 彩蛋档案)
    // ------------------------------------------
    films: [
      {
        id: "casino-royale",
        order: "01",
        year: 2006,
        localBackdrop: "assets/act-1.webp",
        audioSrc: "assets/theme-1.mp3",
        ambientColor: "#0c1d1a",
        theme: "ORIGIN",
        themeZh: "破茧",
        title: "CASINO ROYALE",
        titleZh: "大战皇家赌场",
        director: "Martin Campbell",
        location: "巴哈马 · 黑山 · 威尼斯 / Phil Méheux",
        signatureProp: "Aston Martin DBS · Omega Seamaster 300M",
        palette: {
          primary: "#0c1d1a",
          accent: "#8FA8BE"
        },
        quote: "The name's Bond. James Bond.",
        quoteZh: "“我叫邦德。詹姆斯·邦德。”",
        arcCommentary: "剥离浮华，在背叛与血火中淬炼出冷峻现代特工的诞生。"
      },
      {
        id: "quantum-of-solace",
        order: "02",
        year: 2008,
        localBackdrop: "assets/act-2.webp",
        audioSrc: "assets/theme-2.mp3",
        ambientColor: "#1e1610",
        theme: "VENDETTA",
        themeZh: "焦土",
        title: "QUANTUM OF SOLACE",
        titleZh: "大破量子危机",
        director: "Marc Forster",
        location: "阿塔卡马沙漠 · 锡耶纳 · 布雷根茨",
        signatureProp: "Tom Ford 定制西装 · Omega Planet Ocean",
        palette: {
          primary: "#1e1610",
          accent: "#B88B58"
        },
        quote: "I don't think the dead care about vengeance.",
        quoteZh: "“我不认为死去的人还在乎复仇。”",
        arcCommentary: "穿越干涸焦土，在失控的复仇追猎中寻回特工的克制锚点。"
      },
      {
        id: "skyfall",
        order: "03",
        year: 2012,
        localBackdrop: "assets/act-3.webp",
        audioSrc: "assets/theme-3.mp3",
        ambientColor: "#101922",
        theme: "LEGACY",
        themeZh: "天幕",
        title: "SKYFALL",
        titleZh: "大破天幕杀机",
        director: "Sam Mendes",
        location: "伦敦 · 上海 · 苏格兰高地 / Roger Deakins",
        signatureProp: "Walther PPK 掌纹手枪 · Aston Martin DB5",
        palette: {
          primary: "#101922",
          accent: "#9BA3AB"
        },
        quote: "Sometimes the old ways are the best.",
        quoteZh: "“有时，旧的方法才是最好的。”",
        arcCommentary: "于高地迷雾重返废墟，在母性图腾崩塌后重铸不朽神话。"
      },
      {
        id: "spectre",
        order: "04",
        year: 2015,
        localBackdrop: "assets/act-4.webp",
        audioSrc: "assets/theme-4.mp3",
        ambientColor: "#1e140e",
        theme: "SHADOW",
        themeZh: "暗影",
        title: "SPECTRE",
        titleZh: "幽灵党",
        director: "Sam Mendes",
        location: "墨西哥城 · 罗马 · 奥地利雪山",
        signatureProp: "Omega Seamaster 300 · Tom Ford O’Connor",
        palette: {
          primary: "#1e140e",
          accent: "#B59B6A"
        },
        quote: "A license to kill is also a license not to kill.",
        quoteZh: "“杀人执照，同样也是不杀的执照。”",
        arcCommentary: "直面暗黑罗网的宿命源头，首次在破晓桥头放下枪口抉择。"
      },
      {
        id: "no-time-to-die",
        order: "05",
        year: 2021,
        localBackdrop: "assets/act-5.webp",
        audioSrc: "assets/theme-5.mp3",
        ambientColor: "#16181c",
        theme: "SACRIFICE",
        themeZh: "永恒",
        title: "NO TIME TO DIE",
        titleZh: "无暇赴死",
        director: "Cary Joji Fukunaga",
        location: "马泰拉 · 挪威 · 法罗群岛 / Linus Sandgren",
        signatureProp: "Omega 钛金属海马 · N.Peal 战术针织衫",
        palette: {
          primary: "#16181c",
          accent: "#7D9B8F"
        },
        quote: "The proper function of man is to live, not to exist.",
        quoteZh: "“人的真正使命在于热烈地生活，而非苟且残存。”",
        arcCommentary: "卸下王权枷锁，在晨曦烈火中为所爱之人献出永恒安宁。"
      }
    ],

    // ------------------------------------------
    // 特工器物志 (4 项暗房静物交互展品：DB5 / Seamaster / Tailoring / Walther PPK)
    // ------------------------------------------
    artifacts: [
      {
        id: "db5",
        name: "Aston Martin DB5 (1964)",
        nameZh: "阿斯顿·马丁 DB5 (1964)",
        image: "assets/gear-db5.webp",
        aspectRatio: "16 / 9",
        interactionType: "headlights",
        hotspots: [
          { id: "db5-guns", x: 15.2, y: 47.0, label: "双联装 M134 六管加特林机枪", align: "right" },
          { id: "db5-plate", x: 28.2, y: 66.8, label: "BMT 216A 三面翻转车牌", align: "right" },
          { id: "db5-engine", x: 32.0, y: 54.0, label: "4.0L 直列六缸 · 282 BHP", align: "right" }
        ]
      },
      {
        id: "omega",
        name: "Omega Seamaster Diver 300M",
        nameZh: "欧米茄海马系列 300 米潜水表",
        image: "assets/gear-watch.webp",
        aspectRatio: "1 / 1",
        interactionType: "bezel",
        hotspots: [
          { id: "omega-bezel", x: 50.0, y: 21.5, label: "单向旋转潜水表圈", align: "right", role: "bezel" },
          { id: "omega-calibre", x: 50.0, y: 58.5, label: "英军宽箭头刻印 · 8806 至臻天文台", align: "right" },
          { id: "omega-hev", x: 21.0, y: 32.0, label: "10 点位排氦阀门 · 2 级钛金属", align: "right" }
        ]
      },
      {
        id: "tailoring",
        name: "Bespoke Tailoring & Knitwear",
        nameZh: "高级定制剪裁与战术针织",
        image: "assets/gear-tailoring.webp",
        aspectRatio: "3 / 4",
        interactionType: "loupe",
        hotspots: [
          { id: "tailoring-lapel", x: 49.0, y: 46.0, label: "Tom Ford O'Connor · 手工撬边戗驳领", align: "right" },
          { id: "tailoring-shoulder", x: 83.0, y: 44.0, label: "高袖窿建筑感肩线 · 贴合近战机动", align: "left" },
          { id: "tailoring-knit", x: 18.0, y: 48.0, label: "N.Peal 重磅罗纹海军蓝羊绒针织", align: "right" },
          { id: "tailoring-pocket", x: 52.0, y: 70.0, label: "手工卷边纯白亚麻口袋巾", align: "right" }
        ]
      },
      {
        id: "walther",
        name: "Walther PPK (7.65mm)",
        nameZh: "瓦尔特 PPK 半自动手枪 (7.65mm)",
        image: "assets/gear-ppk.webp",
        aspectRatio: "16 / 9",
        interactionType: "biometric",
        hotspots: [
          { id: "ppk-grip", x: 71.5, y: 56.0, label: "微皮下掌纹生物识别握把 · 仅 007 可击发", align: "left", role: "biometric" },
          { id: "ppk-safety", x: 69.5, y: 16.0, label: "单/双动保险与击锤解脱杆", align: "left" },
          { id: "ppk-slide", x: 26.0, y: 16.0, label: "7.65×17mm 勃朗宁短弹 · 烤蓝钢套筒", align: "right" }
        ]
      }
    ]
  },

  // ==========================================
  // ENGLISH // 英文策展文案
  // ==========================================
  en: {
    meta: {
      title: "007 // Daniel Craig Era Exhibition (2006–2021)",
      description: "A cinematic digital exhibition and curated archive dedicated to Daniel Craig's James Bond era (2006–2021)."
    },

    nav: {
      brandCode: "007 // CRAIG ERA",
      soundOff: "SOUND OFF",
      soundOn: "SOUND ON",
      soundToggleAria: "Toggle scroll-synced ambient soundtrack",
      langToggleZh: "中文",
      langToggleEn: "EN"
    },

    hero: {
      mainTitle: "DANIEL CRAIG",
      titleTranslation: "THE 007 ERA",
      subtitle: "A FIFTEEN-YEAR CHRONICLE OF FLESH, SHADOW & RESILIENCE",
      leadParagraph: "Fifteen years. Five cinematic chapters. Stripped of mid-century flippancy, a modern operative forged through endurance and dignity.",
      scrollPrompt: "SCROLL TO ENTER",
      scrollHint: "Scroll down to enter the exhibition"
    },

    stage: {
      dossierToggleAria: "Toggle current chapter archival notes",
      dossierCloseAria: "Close archival notes",
      dossierLabels: {
        director: "DIRECTOR",
        location: "UNIT & LENS",
        gear: "SIGNATURE"
      }
    },

    artifactsSection: {
      sectionIndex: "01",
      sectionCategory: "Q-BRANCH & BESPOKE TAILORING",
      title: "AESTHETIC ARTIFACTS",
      ui: {
        bezelPrefix: "BEZEL",
        bezelUnit: "MIN"
      }
    },

    mobileGate: {
      kicker: "DESIGNED FOR DESKTOP",
      message: "Crafted for desktop displays and tactile cursor choreography. Visit on a desktop browser for the complete exhibition.",
      dismiss: "Continue Anyway"
    },

    curtainCall: {
      quote: "“We have all the time in the world.”",
      backToTopAria: "Return to top",
      tributeMain: "He turned an immortal myth into a mortal man.",
      tributeCredit: "FOR DANIEL CRAIG · 2006 — 2021",
      willReturn: "JAMES BOND WILL RETURN",
      hnStudioWordmark: "STUDIO",
      hnStudioSub: "DIGITAL ATELIER",
      hnReturnHint: "ESC / CLICK TO RETURN",
      hnCloseAria: "Close HN Studio signature"
    },

    // ------------------------------------------
    // 5 Films Full Metadata
    // ------------------------------------------
    films: [
      {
        id: "casino-royale",
        order: "01",
        year: 2006,
        localBackdrop: "assets/act-1.webp",
        audioSrc: "assets/theme-1.mp3",
        ambientColor: "#0c1d1a",
        theme: "ORIGIN",
        themeZh: "ORIGIN",
        title: "CASINO ROYALE",
        titleZh: "CASINO ROYALE",
        director: "Martin Campbell",
        location: "Bahamas · Montenegro · Venice / Phil Méheux",
        signatureProp: "Aston Martin DBS · Omega Seamaster 300M",
        palette: {
          primary: "#0c1d1a",
          accent: "#8FA8BE"
        },
        quote: "The name's Bond. James Bond.",
        quoteZh: "The name's Bond. James Bond.",
        arcCommentary: "Stripped of conceit, a raw operative is forged through betrayal and blood."
      },
      {
        id: "quantum-of-solace",
        order: "02",
        year: 2008,
        localBackdrop: "assets/act-2.webp",
        audioSrc: "assets/theme-2.mp3",
        ambientColor: "#1e1610",
        theme: "VENDETTA",
        themeZh: "VENDETTA",
        title: "QUANTUM OF SOLACE",
        titleZh: "QUANTUM OF SOLACE",
        director: "Marc Forster",
        location: "Atacama Desert · Siena · Bregenz",
        signatureProp: "Tom Ford Suiting · Omega Planet Ocean",
        palette: {
          primary: "#1e1610",
          accent: "#B88B58"
        },
        quote: "I don't think the dead care about vengeance.",
        quoteZh: "I don't think the dead care about vengeance.",
        arcCommentary: "A breathless desert pursuit where grief yields to hard-won restraint."
      },
      {
        id: "skyfall",
        order: "03",
        year: 2012,
        localBackdrop: "assets/act-3.webp",
        audioSrc: "assets/theme-3.mp3",
        ambientColor: "#101922",
        theme: "LEGACY",
        themeZh: "LEGACY",
        title: "SKYFALL",
        titleZh: "SKYFALL",
        director: "Sam Mendes",
        location: "London · Shanghai · Glencoe / Roger Deakins",
        signatureProp: "Biometric Walther PPK · Aston Martin DB5",
        palette: {
          primary: "#101922",
          accent: "#9BA3AB"
        },
        quote: "Sometimes the old ways are the best.",
        quoteZh: "Sometimes the old ways are the best.",
        arcCommentary: "Broken and obsolete, Bond confronts ancestral ghosts amid Highland mist."
      },
      {
        id: "spectre",
        order: "04",
        year: 2015,
        localBackdrop: "assets/act-4.webp",
        audioSrc: "assets/theme-4.mp3",
        ambientColor: "#1e140e",
        theme: "SHADOW",
        themeZh: "SHADOW",
        title: "SPECTRE",
        titleZh: "SPECTRE",
        director: "Sam Mendes",
        location: "Mexico City · Rome · Austrian Alps",
        signatureProp: "Omega Seamaster 300 · Tom Ford O’Connor",
        palette: {
          primary: "#1e140e",
          accent: "#B59B6A"
        },
        quote: "A license to kill is also a license not to kill.",
        quoteZh: "A license to kill is also a license not to kill.",
        arcCommentary: "Facing the architect of his pain, Bond chooses mercy over execution."
      },
      {
        id: "no-time-to-die",
        order: "05",
        year: 2021,
        localBackdrop: "assets/act-5.webp",
        audioSrc: "assets/theme-5.mp3",
        ambientColor: "#16181c",
        theme: "SACRIFICE",
        themeZh: "SACRIFICE",
        title: "NO TIME TO DIE",
        titleZh: "NO TIME TO DIE",
        director: "Cary Joji Fukunaga",
        location: "Matera · Norway · Faroe Islands / Linus Sandgren",
        signatureProp: "Omega Seamaster 007 Titanium · N.Peal Knit",
        palette: {
          primary: "#16181c",
          accent: "#7D9B8F"
        },
        quote: "The proper function of man is to live, not to exist.",
        quoteZh: "The proper function of man is to live, not to exist.",
        arcCommentary: "Embracing mortal sacrifice under dawn skies to secure a future unstained."
      }
    ],

    // ------------------------------------------
    // Agent Artifacts (4 Darkroom Exhibits: DB5 / Seamaster / Tailoring / Walther PPK)
    // ------------------------------------------
    artifacts: [
      {
        id: "db5",
        name: "Aston Martin DB5 (1964)",
        nameZh: "Aston Martin DB5 (1964)",
        image: "assets/gear-db5.webp",
        aspectRatio: "16 / 9",
        interactionType: "headlights",
        hotspots: [
          { id: "db5-guns", x: 15.2, y: 47.0, label: "Twin Concealed M134 Miniguns", align: "right" },
          { id: "db5-plate", x: 28.2, y: 66.8, label: "Revolving Plate · BMT 216A", align: "right" },
          { id: "db5-engine", x: 32.0, y: 54.0, label: "4.0L Straight-Six · 282 BHP", align: "right" }
        ]
      },
      {
        id: "omega",
        name: "Omega Seamaster Diver 300M",
        nameZh: "Omega Seamaster Diver 300M",
        image: "assets/gear-watch.webp",
        aspectRatio: "1 / 1",
        interactionType: "bezel",
        hotspots: [
          { id: "omega-bezel", x: 50.0, y: 21.5, label: "Unidirectional Rotating Bezel", align: "right", role: "bezel" },
          { id: "omega-calibre", x: 50.0, y: 58.5, label: "Broad Arrow · Co-Axial Calibre 8806", align: "right" },
          { id: "omega-hev", x: 21.0, y: 32.0, label: "Helium Escape Valve · Grade 2 Titanium", align: "right" }
        ]
      },
      {
        id: "tailoring",
        name: "Bespoke Tailoring & Knitwear",
        nameZh: "Bespoke Tailoring & Knitwear",
        image: "assets/gear-tailoring.webp",
        aspectRatio: "3 / 4",
        interactionType: "loupe",
        hotspots: [
          { id: "tailoring-lapel", x: 49.0, y: 46.0, label: "Tom Ford O'Connor · Hand-Stitched Lapel", align: "right" },
          { id: "tailoring-shoulder", x: 83.0, y: 44.0, label: "High-Armhole Architectural Shoulder", align: "left" },
          { id: "tailoring-knit", x: 18.0, y: 48.0, label: "N.Peal Heavy Ribbed Cashmere Knit", align: "right" },
          { id: "tailoring-pocket", x: 52.0, y: 70.0, label: "Hand-Rolled White Linen Pocket Square", align: "right" }
        ]
      },
      {
        id: "walther",
        name: "Walther PPK (7.65mm)",
        nameZh: "Walther PPK (7.65mm)",
        image: "assets/gear-ppk.webp",
        aspectRatio: "16 / 9",
        interactionType: "biometric",
        hotspots: [
          { id: "ppk-grip", x: 71.5, y: 56.0, label: "Palm-Print Biometric Grip · Authorized", align: "left", role: "biometric" },
          { id: "ppk-safety", x: 69.5, y: 16.0, label: "Slide-Mounted Safety & Decocker", align: "left" },
          { id: "ppk-slide", x: 26.0, y: 16.0, label: "7.65mm Browning · Blued Steel Slide", align: "right" }
        ]
      }
    ]
  }
};

// Freeze data to guarantee immutability
if (typeof Object.freeze === "function") {
  Object.freeze(SITE_DATA);
}

if (typeof window !== "undefined") {
  window.SITE_DATA = SITE_DATA;
}
if (typeof globalThis !== "undefined") {
  globalThis.SITE_DATA = SITE_DATA;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = SITE_DATA;
}
