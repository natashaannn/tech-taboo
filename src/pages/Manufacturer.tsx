import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { tabooList } from "../lib/data/tabooList";
import { generateSVG } from "../lib/renderers/cardRenderer";
import {
  PACKAGING_VERSIONS,
  createPackagingSvg,
} from "../lib/renderers/packagingDesignRenderer";
import {
  inlineSvgImages,
  svgToPng,
  svgToPngPrint,
  downloadBlob,
} from "../lib/utils/svgUtils";
import JSZip from "jszip";
import type { TabooCard } from "../types/taboo";

const I18N = {
  en: {
    title: "Manufacturer Download",
    subtitle:
      "Select an edition, then export card PNG files and packaging print files.",
    langLabel: "Language / 语言",
    versionLabel: "Edition / 版本",
    cardsBtn: "Download Cards (PNG ZIP)",
    pkgWholeBtn: "Download Packaging (Whole ZIP)",
    pkgPanelsBtn: "Download Packaging (Panels ZIP)",
    packagingTitle: "Packaging Designs",
    packagingDesc:
      "Export full packaging artwork or individual panel artwork for print.",
    referenceTitle: "Reference Preview",
    referenceCaption:
      "Reference image (card.png). Confirm final print files match font and layout.",
    back: "↩ Back to Tech Taboo",
    comingSoon: "Coming soon",
    statusReady: "Ready.",
    statusError: "Export failed. Please refresh and try again.",
    statusCards: (done: number, total: number) =>
      `Rendering cards... ${done}/${total}`,
    statusPackaging: "Rendering packaging...",
    statusZip: "Generating ZIP...",
    statusDone: "Download started.",
    statusFontError:
      "Export blocked: fonts failed to load. Check your network connection and try again.",
    instructions: (label: string) =>
      `Instructions for ${label}:\n` +
      '1) Click "Download Cards (PNG ZIP)" to get all card fronts for this edition.\n' +
      '2) Click "Download Packaging (Whole ZIP)" to get the full lid layout as one PNG.\n' +
      '3) Click "Download Packaging (Panels ZIP)" to get top/long/short sides as separate PNGs.\n' +
      "4) Unzip all files before print production.",
    packInfo: (label: string, total: number, cats: string) =>
      `${label}: ${total} cards. Category counts: ${cats}.`,
  },
  zh: {
    title: "工厂下载页面",
    subtitle: "请选择版本，然后分别导出卡牌 PNG 和包装印刷文件。",
    langLabel: "语言 / Language",
    versionLabel: "版本 / Edition",
    cardsBtn: "下载卡牌（PNG ZIP）",
    pkgWholeBtn: "下载包装整图（ZIP）",
    pkgPanelsBtn: "下载包装分面（ZIP）",
    packagingTitle: "包装设计文件",
    packagingDesc: "可导出整张包装图，或按面导出（顶面/长边/短边）用于印刷。",
    referenceTitle: "参考预览",
    referenceCaption:
      "参考图（card.png）。请确认最终印刷文件的字体与版式一致。",
    back: "↩ 返回 Tech Taboo",
    comingSoon: "暂未开放",
    statusReady: "已就绪。",
    statusError: "导出失败，请刷新后重试。",
    statusCards: (done: number, total: number) =>
      `正在渲染卡牌... ${done}/${total}`,
    statusPackaging: "正在渲染包装...",
    statusZip: "正在生成 ZIP...",
    statusDone: "已开始下载。",
    statusFontError: "导出已中止：字体加载失败，请检查网络连接后重试。",
    instructions: (label: string) =>
      `${label} 操作说明：\n` +
      '1）点击"下载卡牌（PNG ZIP）"，下载该版本全部卡牌图。\n' +
      '2）点击"下载包装整图（ZIP）"，下载整张包装展开图 PNG。\n' +
      '3）点击"下载包装分面（ZIP）"，下载顶面/长边/短边单独 PNG。\n' +
      "4）下载后请先解压，再交付印刷。",
    packInfo: (label: string, total: number, cats: string) =>
      `${label}：共 ${total} 张卡牌。分类数量：${cats}。`,
  },
};

const PANEL_EXPORT_LAYOUT = [
  { name: "lid-top", x: 29.4, y: 29.4, width: 66, height: 95 },
  { name: "short-side-top", x: 29.4, y: 0, width: 66, height: 29.4 },
  { name: "short-side-bottom", x: 29.4, y: 124.4, width: 66, height: 29.4 },
  { name: "long-side-left", x: 0, y: 29.4, width: 29.4, height: 95 },
  { name: "long-side-right", x: 95.4, y: 29.4, width: 29.4, height: 95 },
];

const CARD_EXPORT_SCALE = 300 / 96;
const CARD_EXPORT_WIDTH = Math.round(610 * CARD_EXPORT_SCALE);
const CARD_EXPORT_HEIGHT = Math.round(910 * CARD_EXPORT_SCALE);

async function cropSvgToPanel(
  svgString: string,
  panel: (typeof PANEL_EXPORT_LAYOUT)[0],
): Promise<string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svg = doc.documentElement;
  const serializer = new XMLSerializer();

  const defsMarkup = Array.from(svg.children)
    .filter((child) => child.tagName.toLowerCase() === "defs")
    .map((child) => serializer.serializeToString(child))
    .join("");

  const contentMarkup = Array.from(svg.children)
    .filter((child) => child.tagName.toLowerCase() !== "defs")
    .map((child) => serializer.serializeToString(child))
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${panel.width}mm" height="${panel.height}mm" viewBox="0 0 ${panel.width} ${panel.height}">
  ${defsMarkup}
  <g transform="translate(${-panel.x} ${-panel.y})">
    ${contentMarkup}
  </g>
</svg>`;
}

export default function Manufacturer() {
  const [lang, setLang] = useState("zh");
  const [selectedEdition, setSelectedEdition] = useState("VARIETY_PACK");
  const [isBusy, setIsBusy] = useState(false);
  const [status, setStatus] = useState("");
  const t = I18N[lang as keyof typeof I18N] || I18N.en;
  const enabledEditions = new Set([
    "VARIETY_PACK",
    "SOFTWARE_INTERVIEW_EXTENSION",
  ]);

  const edition =
    PACKAGING_VERSIONS[selectedEdition as keyof typeof PACKAGING_VERSIONS];

  const resolveCategoryAlias = (category: string) => {
    if (category === "Game Development") return "Game Dev";
    return category;
  };

  const buildEditionPairsFromCounts = () => {
    if (!edition) return [] as TabooCard[];

    const counts = edition.categoryCounts || {};
    const buckets = Object.entries(counts)
      .map(([rawCategory, wordCount]) => {
        const category = resolveCategoryAlias(rawCategory);
        const pool = tabooList.filter((card) => card.category === category);
        return {
          category,
          pool,
          pairTarget: Math.floor(wordCount / 2),
          pairCount: 0,
          cursor: 0,
        };
      })
      .filter((bucket) => bucket.pool.length > 0 && bucket.pairTarget > 0);

    const pairs: TabooCard[] = [];
    let hasRemaining = true;

    while (hasRemaining) {
      hasRemaining = false;

      for (const bucket of buckets) {
        if (bucket.pairCount >= bucket.pairTarget) continue;
        hasRemaining = true;

        const top = bucket.pool[bucket.cursor % bucket.pool.length];
        const bottom = bucket.pool[(bucket.cursor + 1) % bucket.pool.length];
        bucket.cursor += 2;
        bucket.pairCount += 1;

        pairs.push({
          id: `${selectedEdition}-${bucket.category}-${bucket.pairCount}`,
          top,
          bottom,
          createdAt: new Date(),
        });
      }
    }

    return pairs;
  };

  useEffect(() => {
    setStatus(t.statusReady);
  }, [t]);

  const downloadCards = async () => {
    if (isBusy || !edition) return;
    const pairs = buildEditionPairsFromCounts();
    setIsBusy(true);
    setStatus(t.statusCards(0, pairs.length));

    try {
      const svgs: string[] = [];
      for (let i = 0; i < pairs.length; i++) {
        const svg = await generateSVG(pairs[i], {
          category: pairs[i].top.category,
        });
        svgs.push(svg);
        setStatus(t.statusCards(i + 1, pairs.length));
      }

      setStatus(t.statusZip);
      const zip = new JSZip();
      const folder = zip.folder("cards");

      for (let i = 0; i < svgs.length; i++) {
        const png = await svgToPng(
          svgs[i],
          CARD_EXPORT_WIDTH,
          CARD_EXPORT_HEIGHT,
        );
        const categorySlug = String(pairs[i].top.category || "unknown")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        folder?.file(
          `${String(i + 1).padStart(3, "0")}-${categorySlug}-card-${pairs[i].top.index}-${pairs[i].bottom.index}.png`,
          png,
        );
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, `${selectedEdition}-cards.zip`);
      setStatus(t.statusDone);
    } catch (error) {
      console.error("Failed to export cards:", error);
      setStatus(t.statusError);
    }
    setIsBusy(false);
  };

  const downloadPackagingWhole = async () => {
    if (isBusy || !edition) return;
    setIsBusy(true);
    setStatus(t.statusPackaging);

    try {
      const svg = await createPackagingSvg(selectedEdition, {
        useSystemFonts: false,
      });
      const png = await svgToPngPrint(svg, 124.8, 153.8);
      downloadBlob(png, `${selectedEdition}-packaging-whole.png`);
      setStatus(t.statusDone);
    } catch (error) {
      console.error("Failed to export packaging:", error);
      setStatus(t.statusError);
    }
    setIsBusy(false);
  };

  const downloadPackagingPanels = async () => {
    if (isBusy || !edition) return;
    setIsBusy(true);
    setStatus(t.statusPackaging);

    try {
      const svg = await createPackagingSvg(selectedEdition, {
        useSystemFonts: false,
      });
      const inlinedSvg = await inlineSvgImages(svg);
      const zip = new JSZip();
      const panelsFolder = zip.folder("panels");

      for (const panel of PANEL_EXPORT_LAYOUT) {
        const panelSvg = await cropSvgToPanel(inlinedSvg, panel);
        const png = await svgToPngPrint(panelSvg, panel.width, panel.height);
        panelsFolder?.file(`${panel.name}.png`, png);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, `${selectedEdition}-packaging-panels.zip`);
      setStatus(t.statusDone);
    } catch (error) {
      console.error("Failed to export panels:", error);
      setStatus(t.statusError);
    }
    setIsBusy(false);
  };

  // Calculate total cards and category breakdown from edition definition
  const totalCards = edition
    ? Object.values(edition.categoryCounts).reduce(
        (sum, count) => sum + count,
        0,
      ) / 2
    : 0;

  const categoryCounts = edition
    ? Object.entries(edition.categoryCounts)
        .map(([cat, count]) => `${cat} ${count}`)
        .join(", ")
    : "";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
            <div className="mt-4 text-sm text-muted-foreground whitespace-pre-line">
              {t.instructions(edition?.label || selectedEdition)}
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lang">{t.langLabel}</Label>
                      <Select value={lang} onValueChange={setLang}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="zh">中文</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="version">{t.versionLabel}</Label>
                      <Select
                        value={selectedEdition}
                        onValueChange={setSelectedEdition}
                        data-testid="edition-select"
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PACKAGING_VERSIONS).map(
                            ([key, value]) => (
                              <SelectItem
                                key={key}
                                value={key}
                                disabled={!enabledEditions.has(key)}
                              >
                                {value.label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={downloadCards}
                    disabled={isBusy}
                    className="w-full sm:w-auto"
                    data-testid="download-cards-button"
                  >
                    {t.cardsBtn}
                  </Button>
                  <div className="text-sm text-muted-foreground text-center">
                    {status}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="border-t pt-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">{t.packagingTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t.packagingDesc}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={downloadPackagingWhole}
                      disabled={isBusy}
                      data-testid="download-packaging-whole-button"
                    >
                      {t.pkgWholeBtn}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={downloadPackagingPanels}
                      disabled={isBusy}
                      data-testid="download-packaging-panels-button"
                    >
                      {t.pkgPanelsBtn}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-2">{t.referenceTitle}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t.referenceCaption}
                </p>
                <img
                  src="/card.png"
                  alt="Reference card preview"
                  className="w-full max-w-[420px] h-auto border rounded-lg bg-white"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                {edition &&
                  t.packInfo(edition.label, totalCards, categoryCounts)}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
