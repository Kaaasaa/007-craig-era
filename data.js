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
      subtitle: "定义现代特工精神的精密器械、冷硬意志与建筑感剪裁。"
    },

    soundtracksSection: {
      sectionIndex: "02",
      sectionCategory: "THE SONIC LEGACY",
      title: "原声编年史",
      subtitle: "五部独立交响乐章，记录克雷格版邦德的情感碎裂与宿命升华。",
      headers: {
        year: "年份",
        track: "曲目 / 音乐人",
        film: "所属电影",
        critique: "策展短评"
      },
      playAria: "试听曲目",
      pauseAria: "暂停曲目"
    },

    curtainCall: {
      quote: "“We have all the time in the world.”",
      quoteTranslation: "我们拥有世间所有的时间",
      eraMark: "2006 — 2021 · FIN",
      backToTopAria: "返回页面顶部",
      credit: "CURATED BY HN STUDIO"
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
        quote: "A gun gives you an illusion of personal power... you have a choice.",
        quoteZh: "“枪支给人带来掌控的幻觉……但你有权选择不扣动扳机。”",
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
    // 特工器物志 (4 项核心审美符号)
    // ------------------------------------------
    artifacts: [
      {
        id: "db5",
        catalogNumber: "ITEM 01 // SPEC-DB5",
        name: "Aston Martin DB5 (1964)",
        nameZh: "阿斯顿·马丁 DB5 (1964)",
        specs: "4.0L DOHC 直列六缸 / 282 BHP / 银桦色漆面 / BMT 216A 车牌 / M134 微型速射机枪与烟幕系统",
        commentary: "它不仅是一台座驾，更是邦德的情感避难所与终极机械装甲。数十年间在暗室中被无数次手工修复，承载着军情六处的机械遗产，在马泰拉的石板路与苏格兰荒原上发出最后的咆哮。"
      },
      {
        id: "omega",
        catalogNumber: "ITEM 02 // SPEC-SM300",
        name: "Omega Seamaster Diver 300M",
        nameZh: "欧米茄海马系列 300 米潜水表",
        specs: "2 级钛金属表壳 / 同轴至臻天文台 8806 机芯 / 热带棕色铝质表盘 / 英军阔箭标 (Broad Arrow) 军官刻印",
        commentary: "采用 2 级轻量化钛金属打造，配备军用复古铝质潜水圈与英军阔箭标刻印。它不仅能抵御深海重压与强电磁脉冲，更以近乎苦行僧般的精准节奏，伴他默数生命的每一秒钟。"
      },
      {
        id: "walther",
        catalogNumber: "ITEM 03 // SPEC-PPK",
        name: "Walther PPK (7.65mm)",
        nameZh: "瓦尔特 PPK 半自动手枪 (7.65mm)",
        specs: "7.65×17mm 勃朗宁弹 / 微型皮下活体掌纹传感器 / 专属性握把识别 / Q 博士定制防夺枪保险",
        commentary: "终极特工的血肉延伸。在上海高空被 Q 博士升级为微皮下掌纹识别握把，唯有邦德本人的体温与纹理能够击发。冰冷的生铁与掌心血肉在此化作绝密保险。"
      },
      {
        id: "tailoring",
        catalogNumber: "ITEM 04 // SPEC-SARTORIAL",
        name: "Bespoke Tailoring & Knitwear",
        nameZh: "高级定制剪裁与战术针织",
        specs: "Tom Ford O’Connor 级手工剪裁西服 / Barbour Beacon 重磅打蜡猎装夹克 / N.Peal 炭灰罗纹高领羊绒衫",
        commentary: "将战术机能性升华为严苛的建筑美学。高袖窿剪裁令西装在激烈近战中依旧严丝合缝；重磅蜡棉夹克傲立于北国凛风；暗炭灰羊绒针织衫，则将暗影与记忆一同吸纳于胸膛。"
      }
    ],

    // ------------------------------------------
    // 原声编年史 (极简短评 + 音频路径)
    // ------------------------------------------
    soundtracks: [
      {
        year: 2006,
        track: "You Know My Name",
        artist: "Chris Cornell",
        film: "Casino Royale",
        filmZh: "大战皇家赌场",
        audioSrc: "assets/theme-1.mp3",
        critique: "粗砺狂暴的硬摇滚重击，宣告一个肉身会流血的现代 007 破茧而生。"
      },
      {
        year: 2008,
        track: "Another Way to Die",
        artist: "Jack White & Alicia Keys",
        film: "Quantum of Solace",
        filmZh: "大破量子危机",
        audioSrc: "assets/theme-2.mp3",
        critique: "失真吉他与尖锐管乐厮杀，映照在复仇熔炉中分崩离析的灵魂。"
      },
      {
        year: 2012,
        track: "Skyfall",
        artist: "Adele",
        film: "Skyfall",
        filmZh: "大破天幕杀机",
        audioSrc: "assets/theme-3.mp3",
        critique: "深沉铜管与悲怆弦乐交织，献给旧时代残晖的壮丽帝国挽歌。"
      },
      {
        year: 2015,
        track: "Writing's on the Wall",
        artist: "Sam Smith",
        film: "Spectre",
        filmZh: "幽灵党",
        audioSrc: "assets/theme-4.mp3",
        critique: "脆弱假音盘旋于宏大管弦之上，展露强硬外壳下的孤寂战栗。"
      },
      {
        year: 2021,
        track: "No Time to Die",
        artist: "Billie Eilish & Finneas",
        film: "No Time to Die",
        filmZh: "无暇赴死",
        audioSrc: "assets/theme-5.mp3",
        critique: "低语沉寂汇入汉斯·季默的悲壮交响，奏响战士的终极安魂曲。"
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
      subtitle: "Instruments of precision, resilience, and sartorial armor defining the modern operative."
    },

    soundtracksSection: {
      sectionIndex: "02",
      sectionCategory: "THE SONIC LEGACY",
      title: "THE SONIC LEGACY",
      subtitle: "Five distinct orchestral overtures charting the emotional fracture and mythic elevation of Bond.",
      headers: {
        year: "YEAR",
        track: "TRACK / ARTIST",
        film: "FILM",
        critique: "CURATORIAL NOTE"
      },
      playAria: "Preview track",
      pauseAria: "Pause track"
    },

    curtainCall: {
      quote: "“We have all the time in the world.”",
      quoteTranslation: "",
      eraMark: "2006 — 2021 · FIN",
      backToTopAria: "Return to top",
      credit: "CURATED BY HN STUDIO"
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
        quote: "A gun gives you an illusion of personal power... you have a choice.",
        quoteZh: "A gun gives you an illusion of personal power... you have a choice.",
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
    // Agent Artifacts (4 Core Aesthetic Symbols)
    // ------------------------------------------
    artifacts: [
      {
        id: "db5",
        catalogNumber: "ITEM 01 // SPEC-DB5",
        name: "Aston Martin DB5 (1964)",
        nameZh: "Aston Martin DB5 (1964)",
        specs: "4.0L DOHC Inline-6 / 282 BHP / Silver Birch Finish / BMT 216A Plate / Twin M134 Miniguns & Smoke Screen",
        commentary: "More than a vehicle, the DB5 is Bond's emotional sanctum and ultimate mechanical armor. Rebuilt in secret across decades, it bridges the analog heritage of MI6 with bullet-riddled defiance in Matera and Glencoe."
      },
      {
        id: "omega",
        catalogNumber: "ITEM 02 // SPEC-SM300",
        name: "Omega Seamaster Diver 300M",
        nameZh: "Omega Seamaster Diver 300M",
        specs: "Grade 2 Titanium / Co-Axial Master Chronometer Calibre 8806 / Tropical Brown Dial / Broad Arrow Military Engraving",
        commentary: "Constructed with military-grade titanium and an austere tropical aluminum bezel. Built to withstand extreme oceanic depth and electromagnetic pulses, ticking with monastic precision until the final second."
      },
      {
        id: "walther",
        catalogNumber: "ITEM 03 // SPEC-PPK",
        name: "Walther PPK (7.65mm)",
        nameZh: "Walther PPK (7.65mm)",
        specs: "7.65×17mm Browning (.32 ACP) / Biometric Micro-Sensors / Palm-Print Grip Recognition / Q-Branch Custom Failsafe",
        commentary: "The definitive extension of the lethal operative. Upgraded in Shanghai with micro-dermal palm print sensors, ensuring that only Bond's hand can command the hammer, turning personal biology into a declassified failsafe."
      },
      {
        id: "tailoring",
        catalogNumber: "ITEM 04 // SPEC-SARTORIAL",
        name: "Bespoke Tailoring & Knitwear",
        nameZh: "Bespoke Tailoring & Knitwear",
        specs: "Tom Ford Bespoke O’Connor Suiting / Barbour Beacon Waxed Sports Jacket / N.Peal Cashmere Ribbed Mock Turtle",
        commentary: "Tactical elegance elevated to architectural doctrine. High-armhole suiting engineered for close-quarters combat, rugged waxed cotton for northern gales, and dark charcoal cashmere that absorbs shadow and memory alike."
      }
    ],

    // ------------------------------------------
    // The Sonic Legacy
    // ------------------------------------------
    soundtracks: [
      {
        year: 2006,
        track: "You Know My Name",
        artist: "Chris Cornell",
        film: "Casino Royale",
        filmZh: "Casino Royale",
        audioSrc: "assets/theme-1.mp3",
        critique: "Muscular hard-rock overture introducing a 007 who bleeds."
      },
      {
        year: 2008,
        track: "Another Way to Die",
        artist: "Jack White & Alicia Keys",
        film: "Quantum of Solace",
        filmZh: "Quantum of Solace",
        audioSrc: "assets/theme-2.mp3",
        critique: "Fuzz-driven duel mirroring an operative unraveling in grief."
      },
      {
        year: 2012,
        track: "Skyfall",
        artist: "Adele",
        film: "Skyfall",
        filmZh: "Skyfall",
        audioSrc: "assets/theme-3.mp3",
        critique: "Velvet brass and mournful strings celebrating ancient dignity."
      },
      {
        year: 2015,
        track: "Writing's on the Wall",
        artist: "Sam Smith",
        film: "Spectre",
        filmZh: "Spectre",
        audioSrc: "assets/theme-4.mp3",
        critique: "Fragile falsetto drifting over shadows of a lifelong web."
      },
      {
        year: 2021,
        track: "No Time to Die",
        artist: "Billie Eilish & Finneas",
        film: "No Time to Die",
        filmZh: "No Time to Die",
        audioSrc: "assets/theme-5.mp3",
        critique: "Whispered restraint swelling into Hans Zimmer's final requiem."
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
