import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const topic = z.enum(['brewing', 'senses', 'puer', 'vessels', 'storage', 'hosting', 'craft', 'daily', 'learning', 'culture']);

// /journal/<id>/：茶間筆記與茶逢知己共用網址空間
const articles = defineCollection({
  loader: glob({ base: './src/content/journal', pattern: '**/*.md' }),
  schema: z
    .object({
      title: z.string().max(40),
      series: z.enum(['notes', 'column']),
      topic: topic.optional(),
      date: z.coerce.date(),
      excerpt: z.string().min(12).max(100),
      cover: z.string().startsWith('/images/'), // 沿用舊圖片網址（public/images）
      coverAlt: z.string().min(6),
      column: z
        .object({ printedOn: z.coerce.date(), hketId: z.string() }) // 內部資料，頁面只顯示純文字出處
        .optional(),
      related: z.array(reference('articles')).min(3).max(6),
      seo: z.object({ title: z.string().max(32).optional(), description: z.string().max(110).optional() }).default({}),
      draft: z.boolean().default(false),
    })
    .superRefine((v, ctx) => {
      if (v.series === 'notes' && !v.topic) ctx.addIssue({ code: 'custom', message: 'notes 必須有 topic' });
      if (v.series === 'column' && !v.column) ctx.addIssue({ code: 'custom', message: 'column 必須有 column 資料' });
    }),
});

// /repair/<id>/
const repair = defineCollection({
  loader: glob({ base: './src/content/repair', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(24),
      cluster: z.enum(['look', 'method', 'material', 'table', 'people']),
      order: z.number().int(),
      date: z.coerce.date(),
      excerpt: z.string().min(30).max(90),
      cover: image(),
      coverAlt: z.string().min(10),
      relatedTea: z.array(reference('articles')).min(2),
      relatedRepair: z.array(reference('repair')).min(1),
      terms: z.array(z.string()).min(2), // 詞條名；建置時由 remark 插件核對是否存在於 glossary
      factsheet: z.string(), // research/sources/repair/<id>.yaml（不發佈）
      review: z.enum(['draft', 'ai-checked', 'tang-wei-approved']).default('draft'),
      draft: z.boolean().default(false),
    }),
});

// /repair/glossary/#<id>
const glossary = defineCollection({
  loader: file('./src/content/glossary.yaml'),
  schema: z.object({
    term: z.string(),
    aka: z.array(z.string()).default([]),
    group: z.enum(['部位', '材質', '破損', '方法', '觀念', '材料', '工具', '安全', '茶席']),
    short: z.string().max(80),
    body: z.string().max(220),
    seeAlso: z.array(reference('glossary')).default([]),
    needsSource: z.boolean(),
  }),
});

export const collections = { articles, repair, glossary };
