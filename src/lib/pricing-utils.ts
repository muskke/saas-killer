export const getCompetitorPrice = (name: string | undefined): number => {
  if (!name) return 12; // 兜底默认值

  const n = name.toLowerCase();

  // 1. 电商/建站类 (通常基础版较贵，且不完全按人头，但为了计算方便取平均值)
  if (n.includes("shopify")) return 29;
  if (n.includes("webflow")) return 14;
  if (n.includes("wix")) return 16;
  if (n.includes("wordpress")) return 25; // Managed hosting avg

  // 2. CRM/企业软件 (重灾区)
  if (n.includes("salesforce")) return 25; // Essentials
  if (n.includes("hubspot")) return 18; // Starter per seat
  if (n.includes("zendesk")) return 19;

  // 3. 协作/文档 (标准区)
  if (n.includes("notion")) return 10; // Plus
  if (n.includes("airtable")) return 20; // Team
  if (n.includes("monday")) return 12; // Standard
  if (n.includes("clickup")) return 7;
  if (n.includes("jira")) return 15; // Standard
  if (n.includes("confluence")) return 10;
  if (n.includes("slack")) return 8.75; // Pro

  // 4. 设计/开发
  if (n.includes("figma")) return 12; // Pro
  if (n.includes("adobe")) return 59; // CC All Apps
  if (n.includes("vercel")) return 20; // Pro

  return 12; // 行业平均水平
};
