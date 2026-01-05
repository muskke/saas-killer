# 广告联盟配置指南

本指南帮助你配置 `src/components/AdBanner.tsx` 中的广告联盟链接，以获取现金佣金。

---

## 🌍 国际联盟平台

### 1. Impact (https://impact.com)

**平台简介**: 老牌联盟巨头，Namecheap、DigitalOcean、Canva、Shopify 等都在这里。

**申请流程 (Namecheap 为例)**:
1. 访问 [Namecheap Affiliate 页面](https://www.namecheap.com/affiliates/) 点击 "Apply Now" (会跳转到 Impact)。
2. 或者直接登录 Impact 后台，顶部菜单找 **"Brands"** -> **"Find Brands"**。
3. 搜索栏输入 **"Namecheap"**。
4. 点击 **"Apply"**。通常需要 1-2 工作日审核。
5. 通过后，在 Impact 首页 "Create a Link" 处选择 Namecheap 即可生成。

**代码中需要替换的位置**:
```typescript
// Namecheap
link: "https://namecheap.pxf.io/c/YOUR_IMPACT_ID"

// DigitalOcean
link: "https://m.do.co/c/YOUR_DO_CODE"
```

---

### 2. PartnerStack (https://partnerstack.com)

**平台简介**: 现代 SaaS 首选联盟平台，Brevo、Monday.com、Webflow 等都在这里。

**申请流程**:
1. 访问 [PartnerStack 官网](https://partnerstack.com) 注册
2. 搜索 "Brevo" 等品牌 (Notion 请见下方单独链接)
3. 点击 "Join Program" 加入
4. 在 Dashboard 中获取你的推广链接


**💡 Brevo 申请表单填写指南 (参考模板)**:
- **Your business website**: 填你的 Vercel 部署链接 (例如 `https://saas-killer.vercel.app`) 或 GitHub 仓库链接。
- **Tell us a bit about your business**:
  > "I am a Full-Stack Developer leveraging the SaaS Killer boilerplate to build commercial web applications. I create content and open-source tools for the developer community in China. I plan to recommend Brevo as the standard email solution for SaaS projects to my audience of developers and entrepreneurs."
  *(中文意为：我是一名全栈开发者，正在使用 SaaS Killer 模板开发商业应用。我为中国开发者社区创作内容和开源工具。我计划向我的开发者和创业者受众推荐 Brevo 作为 SaaS 项目的首选邮件解决方案。)*

**❓ PartnerStack 通用档案问题 (Apply to the Network)**:
如果遇到询问 **Preferred commission structure** 或 **Rate** 的弹窗，请按以下填写以提高通过率：
- **What is your monthly audience size**: 选 `10,000-50,000` (或根据实际情况选择最接近的)。
- **Preferred commission structure (倾向佣金结构)**:
  - 首选: ✅ **`% Revenue share`** (收入分成，SaaS 最常见，如 Notion)。
  - 次选: ✅ **`CPA (Cost per Action)`** (按成交付费，如 Brevo 付费转化)。
  - *提示: 这是多选题，建议都勾上。如果单选，选 `% Revenue share`。*
- **Preferred rate for content creation (内容创作费率)**:
  - **留空** 或者填 **`0`**。
  - *解释*: 你是作为 Affiliate (分销商) 赚佣金，不是作为 Influencer (网红) 接广告，所以填 0 表示你不需要预付广告费，这样品牌方通过率更高。

**代码中需要替换的位置**:
```typescript
// Brevo (原 Sendinblue)
link: "https://www.brevo.com/?tap_a=YOUR_PARTNERSTACK_ID"
```

---

### 2.1 Notion (单独申请)

Notion 目前有独立的申请入口 (底层可能仍用 PartnerStack 但需通过此链接)：

**申请地址**: [Notion Affiliate Program](https://www.notion.so/affiliates)
或直接访问: https://notion.partnerstack.com/

**📝 如何获取 Notion 推广链接**:

> [!IMPORTANT]
> **关键区别：现金 vs 积分**
> *   **PartnerStack (联盟)**: URL 通常是 `affiliate.notion.so/...` -> 赚 **现金 (Cash)**。
> *   **普通账号 (邀请)**: URL 通常是 `www.notion.so/?r=...` -> 赚 **积分 (Credit)** (抵扣月费)。
> 
> *如果您在 PartnerStack 搜不到 Notion，说明官方现金通道暂时关闭。*

**🅰️ 方案 A：现金通道 (如果能申请)**
1. 登录 PartnerStack，左侧菜单找 "Links"。
2. 如果没有，尝试访问 [notion.partnerstack.com](https://notion.partnerstack.com) 单独申请。

**🅱️ 方案 B：积分通道 (备选)**
1. 登录您的 Notion 网页版。
2. 点击左侧边栏的 **"Settings & members"** (设置与成员)。
3. 点击 **"Earn credit"** (赚取积分)。
4. 复制 "Copy link" (链接格式通常为 `https://www.notion.so/?r=xxxxx`)。
5. 将此链接填入代码，把 `btnText` 改为 "Get Free Credit"。

**代码中需要替换的位置**:
```typescript
// Notion
link: "https://affiliate.notion.so/YOUR_NOTION_ID" 
// 或者 (如果是积分链接)
// link: "https://www.notion.so/?r=YOUR_CODE"
```

---

### 3. Vultr (https://www.vultr.com/promo/try/)

**平台简介**: 直接在官网申请，无需通过第三方平台。

**申请流程**:
1. 登录 Vultr 账户
2. 进入 "Affiliate Program" 页面
3. 申请推广资格
4. 获得推荐链接

**佣金结构**: 每成功推荐一个付费用户，你获得 **$35 现金**。

**代码中需要替换的位置**:
```typescript
link: "https://www.vultr.com/?ref=YOUR_VULTR_REF"
```

---

## 🇨🇳 国内联盟平台

### 4. 阿里云 - 云大使计划

**申请地址**: https://promotion.aliyun.com/ntms/yunparter/invite.html

**佣金结构**:
- 新客户推荐：**23% - 31% 返现**
- 老用户推荐：**15% 返现**

**申请流程**:
1. 使用阿里云账号登录云大使页面
2. 完成实名认证
3. 进入 "我的推广" 获取专属推广链接

**代码中需要替换的位置**:
```typescript
link: "https://www.aliyun.com/daily-act/ecs/activity_selection?userCode=YOUR_ALIYUN_CODE"
```

---

### 5. 腾讯云 - 推广大使计划

**申请地址**: https://cloud.tencent.com/act/cps/redirect

**佣金结构**:
- 基础佣金：**20%** (会员星级越高，佣金越高，最高 **35%**)
- 单笔订单上限：**5000 元**

**申请流程**:
1. 使用腾讯云账号登录推广大使页面
2. 完成实名认证
3. 获取专属推广链接

**代码中需要替换的位置**:
```typescript
link: "https://curl.qcloud.com/YOUR_TENCENT_LINK"
```

---

## ✅ 配置 Checklist

- [ ] 注册 Impact 账户，申请 Namecheap 和 DigitalOcean
- [ ] 注册 PartnerStack 账户，申请 Brevo 和 Notion
- [ ] 注册 Vultr 并申请 Affiliate Program
- [ ] 登录阿里云，成为云大使
- [ ] 登录腾讯云，成为推广大使
- [ ] 在 `AdBanner.tsx` 中替换所有 `YOUR_xxx` 占位符

---

## 💡 提示

- **UTM 追踪**: 代码已自动为所有链接添加 `utm_source=saas-killer` 参数，方便你追踪流量来源。
- **测试链接**: 替换后请点击测试，确保跳转正常。

---

## 🚀 进阶：国内流量变现深度指南 (2025-2026)

为了最大化收益，建议结合以下**四大梯队**策略，根据您的流量类型灵活配置。

### 第一梯队：巨头联盟（基建型，量大稳健）
*适合：保底收入，合规性高。*

| 平台 | 适用场景 | 特点 | 收益参考 |
| :--- | :--- | :--- | :--- |
| **腾讯优量汇 (GDT)** | 小程序、公众号、App | 微信生态唯一合规大型源，社交属性强。 | 激励视频 eCPM 最高 (30-100元)。 |
| **字节穿山甲 (GroMore)** | App、游戏、短视频 | 算法强，填充率极高，转化好。 | 国内 eCPM 表现最好，电商大促期间收益可观。 |
| **快手/百度联盟** | 下沉市场、SEO 站 | 适合特定流量（下沉用户/搜索流量）。 | 补充型收入。 |

### 第二梯队：CPS/CPA 垂直分销（💰 真正的高佣金区）
*适合：精准流量（极客、宝妈、玩家），收益远高于第一梯队。*

*   **短剧分销** (九州、容量、剧里剧外): **当前风口**。CPS 模式 (按充值分成)，佣金比例高达 **50%-80%**。但内容通常偏娱乐，需注意与 SaaS 调性的隔离。
*   **小说/漫画分销** (中文在线): CPA (拉新 6-15元) + CPS (充值分成 40-60%)。
*   **电商联盟** (淘宝/京东/多麦):
    *   **阿里妈妈/京东联盟**: 普通商品 1-5%，但 **高佣榜单** 可达 20-50%。
    *   *SaaS 站长策略*: 推荐 "Developer Gear" (机械键盘、显示器、人体工学椅)，客单价高，佣金可观。
*   **游戏联运** (TapTap): CPA 模式。重度游戏有效注册佣金可达 50-100 元。

### 第三梯队：开发者/工具类聚合（技术变现）
*适合：SaaS、插件、工具站站长。*

*   **聚合广告 SDK (Mediation)**: (TopOn, SigMob, GroMore) 通过 Bidding 技术让多家广告主竞价。能将收益提升 20-50%。App 开发者标配。
*   **🤖 AI 产品分销 (新趋势)**: 国内大模型套壳站、AI 工具合伙人。
    *   **佣金**: 极高 (**30%-50%**)。
    *   *优势*: AI 产品边际成本低，厂商愿高返佣。SaaS 用户群体对 AI 接受度极高，转化率极佳。

### 第四梯队：资源/私单平台（B2B/定制）
*适合：小而美的垂直流量（技术博客、社群）。*

*   **互选广告** (腾讯互选、抖音星图): 广告主直接下单，一口价。万粉垂直号单条广告可报价 2000-5000 元。
*   **应用分发** (2345, 软件管家): 按安装付费 (CPI)。适合 PC 端流量。

---


### 💡 站长行动建议

1.  **基础设施**: 接入 **Vultr / 阿里云** 保证服务器成本覆盖。
2.  **核心变现**: 重点推广 **AI 工具 (第三梯队)** 和 **SaaS 服务 (PartnerStack)**，这是与开发者用户最匹配的高佣金区。
3.  **流量补充**: 在网站 "摸鱼/休息" 区块尝试 **短剧/小说 (第二梯队)** 变现。
4.  **硬件推荐**: 撰写 "开发者好物" 文章，挂 **京东联盟 (第二梯队)** 链接。

---

## ❓ 常见问题 (FAQ)

**Q: 提交申请后 PartnerStack 显示 "Pending" 或 "On hold"？**
A: **这是完全正常的**。
*   **第一步**: 平台需要先审核您的“网络加入申请” (Network Application)，这通常需要 **1-3 个工作日**。
*   **第二步**: 通过后，系统会自动帮您提交 Brevo/Notion 等具体品牌的申请。
*   **行动**: 请耐心等待邮件通知。在此期间，建议您先去申请 **Impact** 平台 (Namecheap, DigitalOcean) 或 **阿里云/腾讯云** 的链接，统筹安排时间。

## ⚡ 极速接入推荐 (不需要等待审核)

如果您不想等待审核，可以优先接入以下**自带推荐计划**的厂商，通常**注册即用**：

| 厂商 | 申请方式 | 速度 | 链接位置 |
| :--- | :--- | :--- | :--- |
| **Vultr** | 官网直接登录 | **秒过** | Account -> Referral Program |
| **DigitalOcean** | 官网直接登录 | **秒过** | Settings -> Referrals (注意是邀请链接，非 Impact 联盟) |
| **阿里云/腾讯云** | 官网直接登录 | **秒过** | 控制台 -> 推广/云大使 |
| **Namecheap** | 官网底部 Affiliate | 快 | 需单独注册，通常比平台快 |

*建议先配置好这些 "秒过" 的链接，等 PartnerStack 审核过了再替换 Brevo/Notion。*



