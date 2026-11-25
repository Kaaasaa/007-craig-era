/**
 * MI6 DECLASSIFIED ARCHIVE // DANIEL CRAIG 007 ERA (2006-2021)
 * Independent Tribute & Lookbook Data Layer
 * 
 * Strict architectural isolation: Zero framework dependencies.
 * Provides complete structured metadata and full bilingual copy.
 */

const SITE_DATA = {
  // ==========================================
  // CHINESE (SIMPLIFIED) // 中文文案
  // ==========================================
  zh: {
    meta: {
      title: "MI6 解密档案 // 丹尼尔·克雷格 007 时代画册 (2006–2021)",
      description: "致敬丹尼尔·克雷格版 007（2006–2021）的沉浸式叙事网页：MI6 解密档案 × 独立电影画册。"
    },

    nav: {
      brandCode: "007 // CRAIG ERA",
      brandSub: "MI6 ARCHIVAL DOSSIER",
      langToggleZh: "中文",
      langToggleEn: "EN"
    },

    hero: {
      archiveHeader: "MI6 ARCHIVE // DOSSIER 2006–2021",
      classification: "TOP SECRET // CLASSIFIED INTEL // VAUXHALL CROSS",
      mainTitle: "DANIEL CRAIG",
      titleTranslation: "丹尼尔·克雷格",
      subtitle: "THE 007 ERA // 时代启示录",
      leadParagraph: "十五载风霜，五部史诗。褪去黄金时代的轻佻与浮华，一个带着血痕、肉身会碎裂、深陷宿命与创伤的现代特工神话。",
      scrollPrompt: "SCROLL TO ENTER",
      scrollHint: "向下滑动以启封机密档案"
    },

    oneShot: {
      badge: "PHASE 2 ARCHITECTURE",
      stageTag: "[ PHASE 2 STAGE // 5-FILM ONE-SHOT SILHOUETTE SEQUENCE ]",
      stageTitle: "五部曲剪影长镜头 · 核心舞台预留",
      timelineLabel: "2006 — 2008 — 2012 — 2015 — 2021",
      description: "架构占位容器：第 2 阶段将在此挂载 GSAP ScrollTrigger 驱动的剪影一镜到底长镜头（Casino Royale 至 No Time to Die 的时空流转与形态演进）。",
      filmsHint: "CASINO ROYALE · QUANTUM OF SOLACE · SKYFALL · SPECTRE · NO TIME TO DIE"
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
      subtitle: "五部独立交响乐章，记录克雷格版邦德的情感碎裂、挣扎与宿命升华。",
      headers: {
        year: "年份",
        track: "曲目 / 音乐人",
        film: "所属电影",
        tag: "声响注记",
        critique: "乐评摘要"
      }
    },

    footer: {
      agentDossier: "AGENT: JAMES BOND // DESIGNATION: 007 // ERA: 2006–2021 // STATUS: RETIRED",
      jurisdiction: "HER MAJESTY'S SECRET INTELLIGENCE SERVICE // SECTION ARCHIVE // LONDON SE1",
      disclaimer: "本网站为非盈利独立艺术画册，致敬丹尼尔·克雷格 15 年间对詹姆斯·邦德传奇的重塑与贡献。无商业用途。",
      backToTop: "BACK TO TOP / 返回顶部"
    },

    // ------------------------------------------
    // 五部曲完整元数据 (预埋 localBackdrop, 坐标, 配色, 弧光评述)
    // ------------------------------------------
    films: [
      {
        id: "casino-royale",
        order: "01",
        year: 2006,
        localBackdrop: "assets/act-1.webp",
        theme: "ORIGIN",
        themeZh: "破茧 · 执刃者",
        title: "Casino Royale",
        titleZh: "大战皇家赌场",
        director: "Martin Campbell",
        runtime: "144 MIN",
        coordinates: {
          location: "Montenegro & Venice",
          geo: "45.4404° N, 12.3160° E"
        },
        palette: {
          primary: "#0A0F16",
          accent: "#8FA8BE",
          overlay: "rgba(143, 168, 190, 0.08)"
        },
        themeSong: {
          title: "You Know My Name",
          artist: "Chris Cornell"
        },
        quote: "The name's Bond. James Bond.",
        quoteZh: "“我叫邦德。詹姆斯·邦德。”",
        quoteContext: "Lake Como, Final Scene",
        quoteContextZh: "意大利科莫湖畔 · 终局时刻",
        arcCommentary: "褪去花哨装备与绅士伪装，一把带血的钝刀在肉搏与背叛中淬火。维斯珀·琳德的决绝赋予了他双零特工的代号，也终身剥夺了他再次托付真心的可能。"
      },
      {
        id: "quantum-of-solace",
        order: "02",
        year: 2008,
        localBackdrop: "assets/act-2.webp",
        theme: "VENDETTA",
        themeZh: "复仇 · 焦土",
        title: "Quantum of Solace",
        titleZh: "大破量子危机",
        director: "Marc Forster",
        runtime: "106 MIN",
        coordinates: {
          location: "Atacama Desert, Bolivia",
          geo: "24.6272° S, 69.3179° W"
        },
        palette: {
          primary: "#16110C",
          accent: "#B88B58",
          overlay: "rgba(184, 139, 88, 0.08)"
        },
        themeSong: {
          title: "Another Way to Die",
          artist: "Jack White & Alicia Keys"
        },
        quote: "I don't think the dead care about vengeance.",
        quoteZh: "“我不认为死去的人还在乎复仇。”",
        quoteContext: "Perla de las Dunas Hotel",
        quoteContextZh: "阿塔卡马沙漠酒店 · 火海对峙",
        arcCommentary: "一场被痛楚与窒息感驱动的极速追猎。在干涸残酷的阿塔卡马沙漠中，他领悟到复仇无法抚平失落，而克制与职责是特工灵魂仅剩的锚点。"
      },
      {
        id: "skyfall",
        order: "03",
        year: 2012,
        localBackdrop: "assets/act-3.webp",
        theme: "LEGACY",
        themeZh: "遗泽 · 天幕",
        title: "Skyfall",
        titleZh: "大破天幕杀机",
        director: "Sam Mendes",
        runtime: "143 MIN",
        coordinates: {
          location: "Glencoe, Scottish Highlands",
          geo: "56.6639° N, 5.0567° W"
        },
        palette: {
          primary: "#101214",
          accent: "#9BA3AB",
          overlay: "rgba(155, 163, 171, 0.08)"
        },
        themeSong: {
          title: "Skyfall",
          artist: "Adele"
        },
        quote: "Sometimes the old ways are the best.",
        quoteZh: "“有时，旧的方法才是最好的。”",
        quoteContext: "Skyfall Lodge, Glencoe",
        quoteContextZh: "苏格兰天幕庄园 · 祖宅诀别",
        arcCommentary: "从死线重返废墟，一身伤痕的旧时代遗留物在苏格兰高地的迷雾荒原中直面童年创伤与母性图腾的终结。天幕破裂，神话重铸。"
      },
      {
        id: "spectre",
        order: "04",
        year: 2015,
        localBackdrop: "assets/act-4.webp",
        theme: "SHADOW",
        themeZh: "暗影 · 罗网",
        title: "Spectre",
        titleZh: "幽灵党",
        director: "Sam Mendes",
        runtime: "148 MIN",
        coordinates: {
          location: "Mexico City & Austrian Alps",
          geo: "19.4326° N, 99.1332° W"
        },
        palette: {
          primary: "#0D0C09",
          accent: "#B59B6A",
          overlay: "rgba(181, 155, 106, 0.08)"
        },
        themeSong: {
          title: "Writing's on the Wall",
          artist: "Sam Smith"
        },
        quote: "A gun gives you an illusion of personal power... you have a choice.",
        quoteZh: "“枪支给人带来拥有掌控力的幻觉……但你有权选择不扣动扳机。”",
        quoteContext: "Westminster Bridge, London",
        quoteContextZh: "伦敦威斯敏斯特桥 · 终局抉择",
        arcCommentary: "深渊般的暗黑罗网将过往所有伤口系于同一阴谋之首。站在伦敦破晓的桥头，他第一次放下了枪口，在无尽的杀戮循环中选择了生者的尊严与远去。"
      },
      {
        id: "no-time-to-die",
        order: "05",
        year: 2021,
        localBackdrop: "assets/act-5.webp",
        theme: "SACRIFICE",
        themeZh: "向死 · 永恒",
        title: "No Time to Die",
        titleZh: "无暇赴死",
        director: "Cary Joji Fukunaga",
        runtime: "163 MIN",
        coordinates: {
          location: "Matera, Italy & Faroe Islands",
          geo: "40.6664° N, 16.6043° E"
        },
        palette: {
          primary: "#091012",
          accent: "#7D9B8F",
          overlay: "rgba(125, 155, 143, 0.08)"
        },
        themeSong: {
          title: "No Time to Die",
          artist: "Billie Eilish"
        },
        quote: "The proper function of man is to live, not to exist.",
        quoteZh: "“人的真正使命在于热烈地生活，而非苟且残存。”",
        quoteContext: "Safin's Island Facility",
        quoteContextZh: "绝密导弹基地发射塔 · 永恒回响",
        arcCommentary: "传奇特工史诗的肃穆落幕。他不再仅仅为王权与疆域而战，而是为了所爱之人不被污染的未来，在烈火与晨曦中从容拥抱属于战士的永恒安宁。"
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
    // 原声遗产 (五部曲编年)
    // ------------------------------------------
    soundtracks: [
      {
        year: 2006,
        track: "You Know My Name",
        artist: "Chris Cornell",
        film: "Casino Royale",
        filmZh: "大战皇家赌场",
        audioSrc: "assets/theme-1.mp3",
        tag: "RAW RESURRECTION // 血性重生",
        critique: "粗砺狂暴的硬摇滚重击，彻底粉碎了过去的从容老派，宣告一个肉身会流血、骨骼会碎裂的全新 007 破茧而生。"
      },
      {
        year: 2008,
        track: "Another Way to Die",
        artist: "Jack White & Alicia Keys",
        film: "Quantum of Solace",
        filmZh: "大破量子危机",
        audioSrc: "assets/theme-2.mp3",
        tag: "FRACTURED SOUL // 裂帛之声",
        critique: "失真躁动的吉他轮击与尖锐管乐的厮杀，宛如特工在未熄的复仇熔炉中分崩离析的精神残像。"
      },
      {
        year: 2012,
        track: "Skyfall",
        artist: "Adele",
        film: "Skyfall",
        filmZh: "大破天幕杀机",
        audioSrc: "assets/theme-3.mp3",
        tag: "SYMPHONIC ELEGY // 帝国挽歌",
        critique: "如天鹅绒般深沉的铜管与悲怆弦乐，与哀婉高贵的声线交织成一曲献给大英帝国旧时代残晖的壮丽挽歌。"
      },
      {
        year: 2015,
        track: "Writing's on the Wall",
        artist: "Sam Smith",
        film: "Spectre",
        filmZh: "幽灵党",
        audioSrc: "assets/theme-4.mp3",
        tag: "SHADOW FALSETTO // 幽灵假音",
        critique: "脆弱而戏剧化的高音盘旋在宏大管弦乐之上，剥开坚硬的外壳，展露被命运提线木偶师步步紧逼时的孤寂战栗。"
      },
      {
        year: 2021,
        track: "No Time to Die",
        artist: "Billie Eilish & Finneas (Orch. Hans Zimmer)",
        film: "No Time to Die",
        filmZh: "无暇赴死",
        audioSrc: "assets/theme-5.mp3",
        tag: "MORTAL REQUIEM // 永恒安魂",
        critique: "近乎私语的沉寂逐渐汇入汉斯·季默如惊涛骇浪般的交响浪潮中，为这位奉献出所有的英雄献上最后的告别安魂曲。"
      }
    ]
  },

  // ==========================================
  // ENGLISH // 英文文案
  // ==========================================
  en: {
    meta: {
      title: "MI6 Declassified Dossier // Daniel Craig 007 Era (2006–2021)",
      description: "An immersive narrative tribute to Daniel Craig's 007 era (2006–2021): MI6 Declassified Dossier × Indie Film Lookbook."
    },

    nav: {
      brandCode: "007 // CRAIG ERA",
      brandSub: "MI6 ARCHIVAL DOSSIER",
      langToggleZh: "中文",
      langToggleEn: "EN"
    },

    hero: {
      archiveHeader: "MI6 ARCHIVE // DOSSIER 2006–2021",
      classification: "TOP SECRET // CLASSIFIED INTEL // VAUXHALL CROSS",
      mainTitle: "DANIEL CRAIG",
      titleTranslation: "THE 007 ERA",
      subtitle: "A FIFTEEN-YEAR CHRONICLE OF FLESH, SHADOW & RESILIENCE",
      leadParagraph: "Fifteen years. Five cinematic masterworks. Stripped of mid-century flippancy, a modern operative forged through bruised bone, enduring grief, and unyielding dignity.",
      scrollPrompt: "SCROLL TO ENTER",
      scrollHint: "Scroll down to declassify the dossier"
    },

    oneShot: {
      badge: "PHASE 2 ARCHITECTURE",
      stageTag: "[ PHASE 2 STAGE // 5-FILM ONE-SHOT SILHOUETTE SEQUENCE ]",
      stageTitle: "Five-Film Silhouette Long Take · Core Stage",
      timelineLabel: "2006 — 2008 — 2012 — 2015 — 2021",
      description: "Architecture placeholder: Phase 2 will mount a continuous GSAP ScrollTrigger silhouette journey across Craig's fifteen-year evolution from raw recruit to mythic transcendence.",
      filmsHint: "CASINO ROYALE · QUANTUM OF SOLACE · SKYFALL · SPECTRE · NO TIME TO DIE"
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
        tag: "SONIC PROFILE",
        critique: "CRITIQUE NOTE"
      }
    },

    footer: {
      agentDossier: "AGENT: JAMES BOND // DESIGNATION: 007 // ERA: 2006–2021 // STATUS: RETIRED",
      jurisdiction: "HER MAJESTY'S SECRET INTELLIGENCE SERVICE // SECTION ARCHIVE // LONDON SE1",
      disclaimer: "Non-commercial independent visual tribute commemorating Daniel Craig's transformative 15-year portrayal of James Bond.",
      backToTop: "BACK TO TOP"
    },

    // ------------------------------------------
    // 5 Films Full Metadata (localBackdrop, coords, palette, arc)
    // ------------------------------------------
    films: [
      {
        id: "casino-royale",
        order: "01",
        year: 2006,
        localBackdrop: "assets/act-1.webp",
        theme: "ORIGIN",
        themeZh: "ORIGIN",
        title: "Casino Royale",
        titleZh: "Casino Royale",
        director: "Martin Campbell",
        runtime: "144 MIN",
        coordinates: {
          location: "Montenegro & Venice",
          geo: "45.4404° N, 12.3160° E"
        },
        palette: {
          primary: "#0A0F16",
          accent: "#8FA8BE",
          overlay: "rgba(143, 168, 190, 0.08)"
        },
        themeSong: {
          title: "You Know My Name",
          artist: "Chris Cornell"
        },
        quote: "The name's Bond. James Bond.",
        quoteZh: "The name's Bond. James Bond.",
        quoteContext: "Lake Como, Final Scene",
        quoteContextZh: "Lake Como, Final Scene",
        arcCommentary: "Stripped of gadgetry and polished conceit, a raw, blunt instrument earns his double-O license through bruised knuckles, heartbreak, and cynicism born of Vesper Lynd's betrayal."
      },
      {
        id: "quantum-of-solace",
        order: "02",
        year: 2008,
        localBackdrop: "assets/act-2.webp",
        theme: "VENDETTA",
        themeZh: "VENDETTA",
        title: "Quantum of Solace",
        titleZh: "Quantum of Solace",
        director: "Marc Forster",
        runtime: "106 MIN",
        coordinates: {
          location: "Atacama Desert, Bolivia",
          geo: "24.6272° S, 69.3179° W"
        },
        palette: {
          primary: "#16110C",
          accent: "#B88B58",
          overlay: "rgba(184, 139, 88, 0.08)"
        },
        themeSong: {
          title: "Another Way to Die",
          artist: "Jack White & Alicia Keys"
        },
        quote: "I don't think the dead care about vengeance.",
        quoteZh: "I don't think the dead care about vengeance.",
        quoteContext: "Perla de las Dunas Hotel",
        quoteContextZh: "Perla de las Dunas Hotel",
        arcCommentary: "A breathless, kinetic pursuit fueled by grief. Bond moves like a tempest through parched deserts, learning that vengeance does not resurrect the dead, nor does it quench the agony of loss."
      },
      {
        id: "skyfall",
        order: "03",
        year: 2012,
        localBackdrop: "assets/act-3.webp",
        theme: "LEGACY",
        themeZh: "LEGACY",
        title: "Skyfall",
        titleZh: "Skyfall",
        director: "Sam Mendes",
        runtime: "143 MIN",
        coordinates: {
          location: "Glencoe, Scottish Highlands",
          geo: "56.6639° N, 5.0567° W"
        },
        palette: {
          primary: "#101214",
          accent: "#9BA3AB",
          overlay: "rgba(155, 163, 171, 0.08)"
        },
        themeSong: {
          title: "Skyfall",
          artist: "Adele"
        },
        quote: "Sometimes the old ways are the best.",
        quoteZh: "Sometimes the old ways are the best.",
        quoteContext: "Skyfall Lodge, Glencoe",
        quoteContextZh: "Skyfall Lodge, Glencoe",
        arcCommentary: "Returning from the grave broken and obsolete, Bond confronts the specters of maternal authority and fractured identity in the mist-shrouded moors of his ancestral childhood. The sky falls, and the myth is reforged."
      },
      {
        id: "spectre",
        order: "04",
        year: 2015,
        localBackdrop: "assets/act-4.webp",
        theme: "SHADOW",
        themeZh: "SHADOW",
        title: "Spectre",
        titleZh: "Spectre",
        director: "Sam Mendes",
        runtime: "148 MIN",
        coordinates: {
          location: "Mexico City & Austrian Alps",
          geo: "19.4326° N, 99.1332° W"
        },
        palette: {
          primary: "#0D0C09",
          accent: "#B59B6A",
          overlay: "rgba(181, 155, 106, 0.08)"
        },
        themeSong: {
          title: "Writing's on the Wall",
          artist: "Sam Smith"
        },
        quote: "A gun gives you an illusion of personal power... you have a choice.",
        quoteZh: "A gun gives you an illusion of personal power... you have a choice.",
        quoteContext: "Westminster Bridge, London",
        quoteContextZh: "Westminster Bridge, London",
        arcCommentary: "An ominous web spun in darkness connects all past wounds to a single architect of pain. For the first time on Westminster Bridge, Bond chooses love and walking away over the mechanical repetition of execution."
      },
      {
        id: "no-time-to-die",
        order: "05",
        year: 2021,
        localBackdrop: "assets/act-5.webp",
        theme: "SACRIFICE",
        themeZh: "SACRIFICE",
        title: "No Time to Die",
        titleZh: "No Time to Die",
        director: "Cary Joji Fukunaga",
        runtime: "163 MIN",
        coordinates: {
          location: "Matera, Italy & Faroe Islands",
          geo: "40.6664° N, 16.6043° E"
        },
        palette: {
          primary: "#091012",
          accent: "#7D9B8F",
          overlay: "rgba(125, 155, 143, 0.08)"
        },
        themeSong: {
          title: "No Time to Die",
          artist: "Billie Eilish"
        },
        quote: "The proper function of man is to live, not to exist.",
        quoteZh: "The proper function of man is to live, not to exist.",
        quoteContext: "Safin's Island Facility",
        quoteContextZh: "Safin's Island Facility",
        arcCommentary: "The definitive dusk of a legendary operational arc. No longer fighting merely for Queen and country, but for the untainted future of those he loves, finding eternity in voluntary self-immolation under the morning light."
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
    // Soundtrack Legacy
    // ------------------------------------------
    soundtracks: [
      {
        year: 2006,
        track: "You Know My Name",
        artist: "Chris Cornell",
        film: "Casino Royale",
        filmZh: "Casino Royale",
        audioSrc: "assets/theme-1.mp3",
        tag: "RAW RESURRECTION",
        critique: "Brash, muscular hard-rock overture shattering the orchestral complacency of the franchise, introducing a 007 who bleeds."
      },
      {
        year: 2008,
        track: "Another Way to Die",
        artist: "Jack White & Alicia Keys",
        film: "Quantum of Solace",
        filmZh: "Quantum of Solace",
        audioSrc: "assets/theme-2.mp3",
        tag: "FRACTURED SOUL",
        critique: "Aggressive fuzz guitar duel and tempestuous brass harmonies mirroring an agent unraveling in the furnace of unvented revenge."
      },
      {
        year: 2012,
        track: "Skyfall",
        artist: "Adele",
        film: "Skyfall",
        filmZh: "Skyfall",
        audioSrc: "assets/theme-3.mp3",
        tag: "SYMPHONIC ELEGY",
        critique: "Velvet brass, mournful strings, and a somber, brooding vocal delivery celebrating the mortal vulnerability and ancient dignity of MI6."
      },
      {
        year: 2015,
        track: "Writing's on the Wall",
        artist: "Sam Smith",
        film: "Spectre",
        filmZh: "Spectre",
        audioSrc: "assets/theme-4.mp3",
        tag: "SHADOW FALSETTO",
        critique: "Fragile, operatic falsetto drifting over cinematic sweeps, exposing an operative stripped bare by the omnipresent puppet master."
      },
      {
        year: 2021,
        track: "No Time to Die",
        artist: "Billie Eilish & Finneas (Orch. Hans Zimmer)",
        film: "No Time to Die",
        filmZh: "No Time to Die",
        audioSrc: "assets/theme-5.mp3",
        tag: "MORTAL REQUIEM",
        critique: "Haunting, whispered restraint swelling into a devastating symphonic crescendo, bidding farewell to the hero who gave everything."
      }
    ]
  }
};

// Freeze data to guarantee immutability across phases
if (typeof Object.freeze === "function") {
  Object.freeze(SITE_DATA);
}

// Global scope attachment for browser & Node.js test environments
if (typeof window !== "undefined") {
  window.SITE_DATA = SITE_DATA;
}
if (typeof globalThis !== "undefined") {
  globalThis.SITE_DATA = SITE_DATA;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = SITE_DATA;
}

