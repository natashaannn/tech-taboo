import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  PACKAGING_VERSIONS,
  PACKAGING_SELECTIONS,
  createPackagingSvg,
  CATEGORY_DESCRIPTIONS,
} from "../lib/renderers/packagingDesignRenderer";
import { ensurePackagingFonts } from "../lib/utils/fontUtils";
import {
  svgToPng,
  downloadBlob,
  svgStringToImageElement,
} from "../lib/utils/svgUtils";
import JSZip from "jszip";

const PANEL_EXPORT_LAYOUT = [
  { name: "lid-top", x: 29.4, y: 29.4, width: 66, height: 95 },
  { name: "short-side-top", x: 29.4, y: 0, width: 66, height: 29.4 },
  { name: "short-side-bottom", x: 29.4, y: 124.4, width: 66, height: 29.4 },
  { name: "long-side-left", x: 0, y: 29.4, width: 29.4, height: 95 },
  { name: "long-side-right", x: 95.4, y: 29.4, width: 29.4, height: 95 },
];

const MM_TO_PX_AT_96 = 96 / 25.4;
const PRINT_DPI = 300;
const DPI_SCALE = PRINT_DPI / 96;

async function cropSvgToPanel(
  svgString: string,
  panel: (typeof PANEL_EXPORT_LAYOUT)[0],
): Promise<string> {
  const img = await svgStringToImageElement(svgString);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // Convert mm to pixels (assuming 96 DPI)
  const mmToPx = 96 / 25.4;
  const pixelWidth = panel.width * mmToPx;
  const pixelHeight = panel.height * mmToPx;
  const pixelX = panel.x * mmToPx;
  const pixelY = panel.y * mmToPx;

  canvas.width = pixelWidth;
  canvas.height = pixelHeight;

  ctx.drawImage(
    img,
    pixelX,
    pixelY,
    pixelWidth,
    pixelHeight,
    0,
    0,
    pixelWidth,
    pixelHeight,
  );

  // Convert canvas back to SVG with embedded image
  const dataUrl = canvas.toDataURL("image/png");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${panel.width}mm" height="${panel.height}mm" viewBox="0 0 ${panel.width} ${panel.height}">
  <image width="100%" height="100%" href="${dataUrl}" />
</svg>`;
}

async function svgToPngPrint(
  svgString: string,
  widthMm: number,
  heightMm: number,
): Promise<Blob> {
  const widthPx = Math.round(widthMm * MM_TO_PX_AT_96);
  const heightPx = Math.round(heightMm * MM_TO_PX_AT_96);

  // Calculate target dimensions at 300 DPI
  const scale = DPI_SCALE;
  const targetWidth = Math.round(widthPx * scale);
  const targetHeight = Math.round(heightPx * scale);

  return svgToPng(svgString, targetWidth, targetHeight, PRINT_DPI);
}

export function Packaging() {
  const [selectedEdition, setSelectedEdition] = useState("VARIETY_PACK");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customVersion, setCustomVersion] = useState("v1.0");
  const [includeBorders, setIncludeBorders] = useState(true);
  const [output, setOutput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!fontsLoaded) {
      return;
    }

    setIsGenerating(true);
    setOutput("");

    try {
      const key = selectedCategory || selectedEdition;
      const svg = await createPackagingSvg(key, {
        includeBorders,
      });
      setOutput(svg);
    } catch (error) {
      console.error("Failed to generate packaging:", error);
      alert(
        "Failed to generate packaging. Please check the console for errors.",
      );
    } finally {
      setIsGenerating(false);
    }
  }, [fontsLoaded, selectedCategory, selectedEdition, includeBorders]);

  useEffect(() => {
    // Preload fonts
    ensurePackagingFonts()
      .then(() => {
        setFontsLoaded(true);
      })
      .catch(console.error);
  }, []);

  // Auto-generate when fonts are loaded and initial selection is made
  useEffect(() => {
    if (fontsLoaded && !output) {
      handleGenerate();
    }
  }, [fontsLoaded, handleGenerate, output]);

  useEffect(() => {
    // Auto-sync description when category/edition changes
    if (!customDescription) {
      const key = selectedCategory || selectedEdition;
      const edition =
        PACKAGING_VERSIONS[key as keyof typeof PACKAGING_VERSIONS];
      const description =
        edition?.description ||
        CATEGORY_DESCRIPTIONS[key as keyof typeof CATEGORY_DESCRIPTIONS] ||
        "";
      setCustomDescription(description);
    }
  }, [selectedEdition, selectedCategory, customDescription]);

  const handleExportPNG = async () => {
    if (!output) return;

    try {
      // Generate fresh SVG with all assets embedded for export
      const key = selectedCategory || selectedEdition;
      const svg = await createPackagingSvg(key, {
        includeBorders,
        useSystemFonts: false,
      });
      const png = await svgToPngPrint(svg, 124.8, 153.8); // High DPI for print
      const filename = `${selectedCategory || selectedEdition}-packaging.png`;
      downloadBlob(png, filename);
    } catch (error) {
      console.error("Failed to export PNG:", error);
      alert("Failed to export PNG. Please check the console for errors.");
    }
  };

  const handleExportPNGNoBorders = async () => {
    if (!output) return;

    try {
      // Generate SVG without borders
      const key = selectedCategory || selectedEdition;
      const svg = await createPackagingSvg(key, {
        includeBorders: false,
        useSystemFonts: false,
      });
      const png = await svgToPngPrint(svg, 124.8, 153.8);
      const filename = `${selectedCategory || selectedEdition}-packaging-no-borders.png`;
      downloadBlob(png, filename);
    } catch (error) {
      console.error("Failed to export PNG:", error);
      alert("Failed to export PNG. Please check the console for errors.");
    }
  };

  const handleExportPanelsZip = async () => {
    if (!output) return;

    try {
      const zip = new JSZip();
      const panelsFolder = zip.folder("panels");

      for (const panel of PANEL_EXPORT_LAYOUT) {
        const panelSvg = await cropSvgToPanel(output, panel);
        const png = await svgToPngPrint(panelSvg, panel.width, panel.height);
        panelsFolder?.file(`${panel.name}.png`, png);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const filename = `${selectedCategory || selectedEdition}-panels.zip`;
      downloadBlob(zipBlob, filename);
    } catch (error) {
      console.error("Failed to export panels:", error);
      alert("Failed to export panels. Please check the console for errors.");
    }
  };

  const handleExportSVG = () => {
    if (!output) return;

    const blob = new Blob([output], { type: "image/svg+xml" });
    const filename = `${selectedCategory || selectedEdition}-packaging.svg`;
    downloadBlob(blob, filename);
  };

  const handleResetDescription = () => {
    const key = selectedCategory || selectedEdition;
    const edition = PACKAGING_VERSIONS[key as keyof typeof PACKAGING_VERSIONS];
    const description =
      edition?.description ||
      CATEGORY_DESCRIPTIONS[key as keyof typeof CATEGORY_DESCRIPTIONS] ||
      "";
    setCustomDescription(description);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Packaging Lid Renderer
            </h1>
            <p className="text-muted-foreground">
              Rigid box full-lid layout with 5 sides: lid top 66x95mm, long side
              95x29.4mm x2, short side 66x29.4mm x2.
            </p>
          </div>

          {/* Preview */}
          {output && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Packaging Preview</CardTitle>
                    <CardDescription>
                      Preview of your packaging design (1:1 scale)
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleExportSVG}
                      disabled={!output}
                    >
                      Export as SVG
                    </Button>
                    <Button onClick={handleExportPNG} disabled={!output}>
                      Export as PNG (Print Quality)
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto bg-gray-50 rounded-lg p-4">
                  <div
                    dangerouslySetInnerHTML={{ __html: output }}
                    style={{
                      width: "100%",
                      maxWidth: "980px",
                      margin: "0 auto",
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Packaging Options</CardTitle>
              <CardDescription>
                Configure your packaging design settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category / Edition</Label>
                  <Select
                    value={selectedCategory || selectedEdition}
                    onValueChange={(value) => {
                      // Determine if it's an edition or category
                      const isEdition =
                        PACKAGING_VERSIONS[
                          value as keyof typeof PACKAGING_VERSIONS
                        ] !== undefined;
                      if (isEdition) {
                        setSelectedEdition(value);
                        setSelectedCategory("");
                      } else {
                        setSelectedCategory(value);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category or edition" />
                    </SelectTrigger>
                    <SelectContent>
                      {PACKAGING_SELECTIONS.map(
                        ({ key, label }: { key: string; label: string }) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    placeholder="Enter version"
                    value={customVersion}
                    onChange={(e) => setCustomVersion(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter description"
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="borders">Borders</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="borders"
                      checked={includeBorders}
                      onCheckedChange={setIncludeBorders}
                    />
                    <Label htmlFor="borders" className="text-sm">
                      Include Panel Borders
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !fontsLoaded}
                >
                  {isGenerating ? "Generating..." : "Generate Packaging"}
                </Button>
                <Button variant="outline" onClick={handleResetDescription}>
                  Reset Category Description
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportPNGNoBorders}
                  disabled={!output}
                >
                  Export PNG (No Borders)
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportPanelsZip}
                  disabled={!output}
                >
                  Export Panels PNG ZIP
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          {selectedEdition && !selectedCategory && (
            <Card>
              <CardHeader>
                <CardTitle>Edition Info</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {
                    PACKAGING_VERSIONS[
                      selectedEdition as keyof typeof PACKAGING_VERSIONS
                    ]?.description
                  }
                </p>
                <p className="text-sm">
                  <strong>Categories:</strong>{" "}
                  {PACKAGING_VERSIONS[
                    selectedEdition as keyof typeof PACKAGING_VERSIONS
                  ]?.categories.join(", ")}
                </p>
              </CardContent>
            </Card>
          )}

          {selectedCategory &&
            CATEGORY_DESCRIPTIONS[
              selectedCategory as keyof typeof CATEGORY_DESCRIPTIONS
            ] && (
              <Card>
                <CardHeader>
                  <CardTitle>Category Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {
                      CATEGORY_DESCRIPTIONS[
                        selectedCategory as keyof typeof CATEGORY_DESCRIPTIONS
                      ]
                    }
                  </p>
                </CardContent>
              </Card>
            )}
        </div>
      </main>
    </div>
  );
}
