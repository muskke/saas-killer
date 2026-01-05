"use client";

import {
  Sparkles,
  Server,
  Globe,
  Mail,
  Database,
  ArrowRight,
  X,
  Zap,
  Code2,
  Cloud,
  Gamepad2,
  MessageSquare,
  ShoppingCart,
  Video,
  type LucideIcon,
} from "lucide-react";
import { useState, useEffect } from "react";

// --- 1. CONFIGURATION (策略中心) ---
// 定义不同的广告策略组
type AdConfig = {
  id: string;
  keywords: string[]; // 🔥 核心升级：只要分类包含这些词，就出这个广告
  name: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  gradient: string;
  link: string;
  btnText: string;
  validUntil?: string; // 📅 有效期 (ISO 格式: "YYYY-MM-DD")
};

const ADS: AdConfig[] = [
  // ====== 🌍 国际广告 (International) ======
  // 1. 域名/建站 -> Namecheap (Impact 平台)
  {
    id: "domains",
    keywords: ["cms", "website", "blog", "forum", "wiki", "ecommerce", "shop"],
    name: "Namecheap",
    title: "Professional Domains",
    desc: "Don't stay on localhost. Grab a .com for $5.98/yr.",
    icon: Globe,
    gradient: "from-orange-500 via-red-500 to-pink-600",
    link: "https://namecheap.pxf.io/c/YOUR_IMPACT_ID", // 👈 替换为你的 Impact ID
    btnText: "Search Domains",
  },
  // 2. 后端/VPS -> Vultr (直接现金 $35)
  {
    id: "backend",
    keywords: ["database", "sql", "backend", "baas", "firebase", "postgres", "docker"],
    name: "Vultr",
    title: "Cloud Infrastructure",
    desc: "Spin up a high-performance SSD VPS or Managed Database in seconds.",
    icon: Database,
    gradient: "from-blue-600 via-indigo-500 to-purple-500",
    link: "https://www.vultr.com/?ref=YOUR_VULTR_REF", // 👈 替换为你的 Vultr 推荐码
    btnText: "Get $100 Credit",
  },
  // 3. 邮件/营销 -> Brevo (PartnerStack 平台)
  {
    id: "email",
    keywords: ["marketing", "email", "newsletter", "crm", "communication"],
    name: "Brevo",
    title: "The All-in-One CRM",
    desc: "Send emails, track customers, and automate marketing. Free tier included.",
    icon: Mail,
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    link: "https://www.brevo.com/?tap_a=YOUR_PARTNERSTACK_ID", // 👈 替换为你的 PartnerStack ID
    btnText: "Start for Free",
  },
  // 4. 生产力/协作 -> Notion (PartnerStack 平台)
  {
    id: "productivity",
    keywords: ["design", "project", "task", "note", "office", "writing"],
    name: "Notion",
    title: "Organize Everything",
    desc: "The connected workspace for your docs, tasks, and projects.",
    icon: Zap,
    gradient: "from-gray-700 via-gray-800 to-black",
    link: "https://affiliate.notion.so/YOUR_NOTION_ID", // 👈 替换为你的 Notion Affiliate ID
    btnText: "Try Notion AI",
  },

  // ====== 🇨🇳 国内广告 (China) ======
  // 5. 云服务 -> 阿里云 (云大使计划, 23%-31% 返现)
  {
    id: "aliyun",
    keywords: ["云服务", "服务器", "ecs", "oss", "云计算", "china", "国内"],
    name: "阿里云",
    title: "上云就上阿里云",
    desc: "全球领先的云计算服务商。新用户专享优惠，高性能 ECS 低至 99 元/年。",
    icon: Cloud,
    gradient: "from-orange-400 via-orange-500 to-red-500",
    link: "https://www.aliyun.com/minisite/goods?userCode=n8agepcj", // ✅ 已配置
    btnText: "领取优惠",
  },
  // ====== 🐧 腾讯云全家桶 (Tencent Ecosystem) ======
  // 6. 综合云服务 -> 通用爆款
  {
    id: "tencent-general",
    keywords: ["tencent", "qcloud", "cdn", "cos", "腾讯云", "云服务"],
    name: "腾讯云·精选",
    title: "云产品特惠热卖",
    desc: "云服务器、数据库、COS、CDN 等爆款产品特惠中。新客首购低至 1 折。",
    icon: Server,
    gradient: "from-blue-500 via-indigo-500 to-blue-600",
    link: "https://curl.qcloud.com/WzSerhUf", // ✅ 通用特惠
    btnText: "查看爆款",
  },
  // 7. AI 算力 -> GPU/大模型
  {
    id: "tencent-ai",
    keywords: ["gpu", "cuda", "nvidia", "training", "h800", "算力", "model"],
    name: "腾讯云·AI",
    title: "AI 算力 0.8 折起",
    desc: "高性能 GPU 服务器，百万大模型 Tokens 免费体验。助你低成本训练专属模型。",
    icon: Sparkles, // 复用 Sparkles
    gradient: "from-violet-600 via-indigo-600 to-purple-700",
    link: "https://curl.qcloud.com/4xzDipNp", // ✅ AI 算力
    btnText: "获取算力",
  },
  // 8. 游戏服 -> 游戏联机/帕鲁
  {
    id: "tencent-game",
    keywords: ["game", "minecraft", "palworld", "steam", "游戏", "幻兽帕鲁", "联机"],
    name: "腾讯云·游戏",
    title: "一键开服，即刻畅玩",
    desc: "热卖游戏服配置低至 32 元/月。幻兽帕鲁、Minecraft 一键部署，不掉线不卡顿。",
    icon: Gamepad2,
    gradient: "from-fuchsia-500 via-pink-500 to-rose-500",
    link: "https://curl.qcloud.com/ocEBP0Bd", // ✅ 游戏服
    btnText: "一键开黑",
  },
  // 9. 语音/音视频 -> TRTC/ASR
  {
    id: "tencent-media",
    keywords: ["voice", "speech", "asr", "tts", "video", "meeting", "语音", "直播"],
    name: "腾讯云·音视频",
    title: "音视频低代码开发",
    desc: "语音识别准确率高，音视频组件 3 步集成。视频通信爆款 9.9 元起。",
    icon: Video,
    gradient: "from-sky-400 via-cyan-500 to-teal-500",
    link: "https://curl.qcloud.com/NpKN8nl7", // ✅ 视频通信 (也可选语音链接)
    btnText: "极速集成",
  },
  // 10. 出海/电商 -> Lighthouse
  {
    id: "tencent-global",
    keywords: ["cross-border", "global", "sea", "出海", "电商", "shopify", "tiktok"],
    name: "腾讯云·出海",
    title: "跨境电商扬帆出海",
    desc: "Lighthouse 助力跨境业务。全球节点覆盖，网络稳定，助你轻松卖全球。",
    icon: ShoppingCart,
    gradient: "from-orange-400 via-amber-500 to-yellow-500",
    link: "https://curl.qcloud.com/mN7ivrRL", // ✅ 跨境电商
    btnText: "拓展海外",
  },
  // 11. IM 即时通信
  {
    id: "tencent-im",
    keywords: ["im", "chat-sdk", "message", "communication", "聊天", "social"],
    name: "腾讯云·IM",
    title: "构建智能聊天能力",
    desc: "即时通信 IM 接入 AI 服务，快速搭建支持亿级并发的聊天系统。",
    icon: MessageSquare,
    gradient: "from-blue-600 via-blue-700 to-indigo-800",
    link: "https://curl.qcloud.com/7EJ8uUX9", // ✅ IM
    btnText: "立即接入",
  },

  // ====== 🇨🇳 阿里云全家桶 (Aliyun Ecosystem) ======
  // 7. AI 编程 -> 通义灵码 (新用户最高 45% 返利)
  {
    id: "aliyun-lingma",
    keywords: ["code", "copilot", "chatgpt", "dev", "programming", "智能编码"],
    name: "通义灵码",
    title: "你的 AI 编程搭子",
    desc: "阿里云出品的智能编码助手。代码自动补全、自然语言生成代码，个人版永久免费。",
    icon: Code2,
    gradient: "from-blue-600 via-purple-600 to-fuchsia-600",
    link: "https://dashi.aliyun.com/activity/lingma?userCode=n8agepcj", // ✅ 灵码活动
    btnText: "免费安装",
  },
  // 8. 大模型 -> DeepSeek 专属 (爆火活动)
  {
    id: "aliyun-deepseek",
    keywords: ["llm", "deepseek", "model", "inference", "gpu", "推理"],
    name: "DeepSeek",
    title: "一键部署 DeepSeek",
    desc: "告别繁琐配置。在阿里云 ECS 上一键拉起满血版 DeepSeek，算力按需付费。",
    icon: Sparkles,
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    link: "https://www.aliyun.com/daily-act/ecs/ecs25srdeepseek?userCode=n8agepcj", // ✅ DeepSeek 活动
    btnText: "立即部署",
  },
  // 9. 建站/域名 -> 阿里云万网
  {
    id: "aliyun-web",
    keywords: ["site", "domain", "wordpress", "建站", "域名", "备案"],
    name: "阿里云万网",
    title: "建站就选万网",
    desc: "精选多款建站产品，10分钟快速上线。域名注册+云解析+备案一站式服务。",
    icon: Globe,
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    link: "https://wanwang.aliyun.com/webdesign/index?userCode=n8agepcj", // ✅ 建站活动
    btnText: "快速建站",
  },
  // 10. 云办公 -> 无影云电脑
  {
    id: "aliyun-wuying",
    keywords: ["pc", "desktop", "remote", "windows", "computer", "办公", "云电脑"],
    name: "无影云电脑",
    title: "把电脑装进云端",
    desc: "算力跟随账号，随时随地访问你的云端桌面。个人版免费试用。",
    icon: Cloud,
    gradient: "from-teal-400 via-emerald-500 to-green-600",
    link: "https://www.aliyun.com/activity/wuying/dj?userCode=n8agepcj", // ✅ 无影活动
    btnText: "0元试用",
  },

  // ====== 💰 其他高佣金扩展 ======
  // 💡 这是一个有时效性的单品推荐，过期后会自动隐藏，回退到兜底或通用广告
  {
    id: "gear-daily",
    keywords: ["usb", "cable", "type-c", "desk", "setup"], // 针对性关键词
    name: "京东福利",
    title: "今日好物推荐",
    desc: "Type-C 数显快充线 / 创意 LED 小夜灯，限时特惠。",
    icon: Zap,
    gradient: "from-red-600 via-red-500 to-orange-500",
    link: "https://u.jd.com/AOxnJnF",
    btnText: "抢购特惠",
    validUntil: "2025-02-01", // 📅 设置一个有效期，过期自动不显示
  },
  // 12. 电商/好物 (通用长期备胎)
  {
    id: "gear-f",
    keywords: ["keyboard", "monitor", "chair", "装备", "硬件"],
    name: "京东联盟",
    title: "开发者装备党",
    desc: "工欲善其事，必先利其器。精选程序员人体工学椅、机械键盘。",
    icon: ShoppingCart,
    gradient: "from-red-600 via-red-500 to-orange-500",
    link: "https://union.jd.com/proManager/index?pageNo=1", // 👈 建议替换为你的京东联盟首页或长期活动页
    btnText: "查看优惠",
  },


  // ====== 兜底广告 (Fallback) ======
  // 7. 默认 -> DigitalOcean (Impact 平台, 转化率高)
  {
    id: "hosting",
    keywords: ["default"], // 永远匹配不到，作为兜底
    name: "DigitalOcean",
    title: "Deploy in seconds.",
    desc: "Don't just read the code. Run this tool on a high-performance Droplet.",
    icon: Cloud,
    gradient: "from-blue-600 via-indigo-600 to-violet-700",
    link: "https://m.do.co/c/3c0405dec741", // ✅ DigitalOcean ($200 Credit)
    btnText: "Claim $200 Credit",
  },
];

// --- 2. THE COMPONENT ---
export default function AdBanner({ category = "" }: { category?: string }) {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔥 核心逻辑：关键词加权匹配 + 时效性过滤
  const getRelevantAd = (cat: string) => {
    const normalizedCat = cat.toLowerCase();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // 🔍 辅助函数：检查广告是否有效
    const isValid = (ad: AdConfig) => {
      if (!ad.validUntil) return true; // 永久有效
      return ad.validUntil >= today;
    };

    // 遍历所有广告配置
    for (const ad of ADS) {
      // 0. 先检查有效期
      if (!isValid(ad)) continue;

      // 1. 检查该广告的关键词是否出现在当前分类中
      if (ad.keywords.some((keyword) => normalizedCat.includes(keyword))) {
        return ad;
      }
    }

    // 没找到？返回最后一个（默认广告），确保兜底广告有效
    const defaultAd = ADS[ADS.length - 1];
    return isValid(defaultAd) ? defaultAd : ADS[0];
  };

  const ad = getRelevantAd(category);
  const Icon = ad.icon;

  // 自动追加 UTM 参数
  const trackableLink = `${ad.link}${ad.link.includes("?") ? "&" : "?"
    }utm_source=saas-killer&utm_medium=banner&utm_content=${ad.id}`;

  if (!isVisible || !mounted) return null;

  return (
    <div className="relative group my-12 w-full transform transition-all hover:scale-[1.01]">
      {/* 1. 动态光晕背景 (Glow Effect) */}
      <div
        className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${ad.gradient} opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200 animate-tilt`}
      ></div>

      {/* 2. 主卡片容器 */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 rounded-xl bg-gray-900 px-6 py-6 md:px-8 shadow-2xl overflow-hidden">
        {/* 背景纹理 (Noise Texture) - 增加高级感 */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* 标签 */}
        <div className="absolute top-0 left-0 bg-white/10 backdrop-blur-md text-white/70 text-[10px] font-bold tracking-widest px-3 py-1 rounded-br-lg uppercase z-20 border-r border-b border-white/5">
          Recommended Tool
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsVisible(false);
          }}
          className="absolute top-2 right-2 p-1 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-all z-20"
        >
          <X size={14} />
        </button>

        {/* 左侧：图标与文案 */}
        <div className="flex items-center gap-5 z-10 w-full md:w-auto relative">
          {/* Logo 容器 */}
          <div
            className={`hidden md:flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${ad.gradient} text-white shadow-lg shadow-black/50 ring-1 ring-white/10`}
          >
            <Icon size={32} strokeWidth={1.5} />
          </div>

          <div className="text-center md:text-left flex-1">
            <h4 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
              {ad.title}
              <span className="hidden md:inline-flex items-center rounded-md bg-white/10 px-2 py-0.5 text-xs font-medium text-white ring-1 ring-inset ring-white/20">
                {ad.name}
              </span>
            </h4>
            <p className="text-sm text-gray-400 mt-2 max-w-lg font-medium leading-relaxed">
              {ad.desc}
            </p>
          </div>
        </div>

        {/* 右侧：行动按钮 (带流光特效) */}
        <a
          href={trackableLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-3.5 text-sm font-bold text-gray-900 transition-all hover:bg-gray-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] w-full md:w-auto justify-center z-10"
        >
          {/* 按钮内的流光动画 */}
          <div className="absolute inset-0 -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-black/5 to-transparent skew-x-12"></div>

          <span className="relative">{ad.btnText}</span>
          <ArrowRight
            size={16}
            className="relative transition-transform group-hover/btn:translate-x-1"
          />
        </a>
      </div>
    </div>
  );
}
