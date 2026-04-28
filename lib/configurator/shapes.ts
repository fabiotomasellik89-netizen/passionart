import type { ShapeKey } from "@/types";
import { shapePresets } from "@/lib/data/demo-catalog";

export type ShapeConfig = {
  key: ShapeKey;
  label: string;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  defaultWidth: number;
  defaultHeight: number;
  defaultThickness: number;
  minThickness: number;
  maxThickness: number;
  maxTextLength: number;
  baseFactor: number;
};

export const SHAPES: Record<ShapeKey, ShapeConfig> = Object.fromEntries(
  shapePresets.map((shape) => [
    shape.key,
    {
      ...shape,
      defaultThickness: 1,
      minThickness: 0.4,
      maxThickness: 2.2,
      maxTextLength: shape.key === "rettangolo" ? 48 : 28,
    },
  ]),
) as Record<ShapeKey, ShapeConfig>;

export function getShapeConfig(shape: ShapeKey) {
  return SHAPES[shape];
}

export function renderShapeSVG(shape: ShapeKey, width: number, height: number, text = "") {
  const viewWidth = 320;
  const viewHeight = 240;
  const fill = "#e8c9a9";
  const stroke = "#8c6b56";
  const engraving = text.slice(0, 26);

  const shapeNode: Record<ShapeKey, string> = {
    cuore:
      '<path d="M160 185c-42-25-92-61-92-110 0-33 24-57 55-57 18 0 31 8 37 20 6-12 19-20 37-20 31 0 55 24 55 57 0 49-50 85-92 110Z" />',
    stella:
      '<path d="M160 22l25 53 58 5-44 37 14 57-53-29-53 29 14-57-44-37 58-5 25-53Z" />',
    rettangolo:
      '<rect x="52" y="48" width="216" height="144" rx="26" />',
    cerchio:
      '<circle cx="160" cy="120" r="78" />',
    albero:
      '<path d="M160 26c34 0 66 21 78 57 10 27 7 45-6 66-10 15-24 26-42 31v39h-20v-39c-19-4-34-16-44-32-14-22-15-44-4-72 14-34 43-50 38-50Z" />',
    casetta:
      '<path d="M160 30 252 99v105H68V99l92-69Z" /><rect x="138" y="126" width="44" height="78" rx="14" />',
  };

  return `
    <svg viewBox="0 0 ${viewWidth} ${viewHeight}" xmlns="http://www.w3.org/2000/svg" width="${viewWidth}" height="${viewHeight}">
      <rect width="${viewWidth}" height="${viewHeight}" rx="32" fill="#fcf3ea" />
      <g transform="translate(${(viewWidth - width * 12) / 2}, ${(viewHeight - height * 10) / 2}) scale(${Math.max(
        0.85,
        Math.min(1.4, width / 10),
      )}, ${Math.max(0.85, Math.min(1.35, height / 10))})">
        <g fill="${fill}" stroke="${stroke}" stroke-width="4">
          ${shapeNode[shape]}
        </g>
      </g>
      <text x="160" y="124" text-anchor="middle" font-size="16" fill="#704f52" font-family="Georgia, serif">${engraving}</text>
      <text x="160" y="220" text-anchor="middle" font-size="12" fill="#9b7f74" font-family="Arial, sans-serif">${width}×${height} cm</text>
    </svg>
  `;
}
